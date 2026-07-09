(function () {
  const supabaseUrlKey = "binocart.supabase.url.v1";
  const supabaseAnonKeyKey = "binocart.supabase.anon.v1";
  let client = null;
  let state = {
    authAvailable: Boolean(globalThis.supabase?.createClient),
    configured: false,
    ready: false,
    session: null,
    user: null,
    error: ""
  };

  function trim(value) {
    return String(value || "").trim();
  }

  function snapshot() {
    return {
      authAvailable: state.authAvailable,
      configured: state.configured,
      ready: state.ready,
      session: state.session,
      user: state.user,
      error: state.error,
      userEmail: state.user?.email || "",
      hasSession: Boolean(state.session)
    };
  }

  function emit() {
    if (typeof window?.dispatchEvent !== "function") return;
    if (typeof CustomEvent === "function") {
      window.dispatchEvent(new CustomEvent("binocart-auth-change", { detail: snapshot() }));
      return;
    }
    if (typeof Event === "function") {
      window.dispatchEvent(new Event("binocart-auth-change"));
    }
  }

  function getConfig() {
    return {
      url: trim(localStorage.getItem(supabaseUrlKey)),
      anonKey: trim(localStorage.getItem(supabaseAnonKeyKey))
    };
  }

  function setState(next) {
    state = {
      ...state,
      ...next,
      authAvailable: Boolean(globalThis.supabase?.createClient)
    };
    emit();
  }

  async function init() {
    const config = getConfig();
    client = null;
    setState({
      configured: Boolean(config.url && config.anonKey),
      ready: false,
      session: null,
      user: null,
      error: ""
    });

    if (!config.url || !config.anonKey) {
      setState({ ready: true });
      return snapshot();
    }

    if (!globalThis.supabase?.createClient) {
      setState({ ready: true, error: "Supabase client library unavailable." });
      return snapshot();
    }

    client = globalThis.supabase.createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    if (typeof client.auth?.onAuthStateChange === "function") {
      client.auth.onAuthStateChange(function (_event, session) {
        setState({
          ready: true,
          session: session || null,
          user: session?.user || null,
          error: ""
        });
      });
    }

    try {
      const result = typeof client.auth?.getSession === "function"
        ? await client.auth.getSession()
        : { data: { session: null }, error: null };
      if (result?.error) throw result.error;
      setState({
        ready: true,
        session: result?.data?.session || null,
        user: result?.data?.session?.user || null,
        error: ""
      });
    } catch (error) {
      setState({ ready: true, error: error?.message || "Could not load Supabase session." });
    }

    return snapshot();
  }

  async function setConfig(url, anonKey) {
    const nextUrl = trim(url);
    const nextAnonKey = trim(anonKey);

    if (nextUrl) localStorage.setItem(supabaseUrlKey, nextUrl);
    else localStorage.removeItem(supabaseUrlKey);

    if (nextAnonKey) localStorage.setItem(supabaseAnonKeyKey, nextAnonKey);
    else localStorage.removeItem(supabaseAnonKeyKey);

    return init();
  }

  async function clearConfig() {
    localStorage.removeItem(supabaseUrlKey);
    localStorage.removeItem(supabaseAnonKeyKey);
    client = null;
    setState({ configured: false, ready: true, session: null, user: null, error: "" });
    return snapshot();
  }

  async function signInWithOtp(email) {
    if (!client?.auth?.signInWithOtp) {
      throw new Error("Supabase auth is not configured yet.");
    }

    const address = trim(email).toLowerCase();
    if (!address) throw new Error("Enter an email address first.");

    const redirectTo = window?.location?.origin && window?.location?.pathname
      ? `${window.location.origin}${window.location.pathname}`
      : undefined;
    const payload = redirectTo
      ? { email: address, options: { emailRedirectTo: redirectTo } }
      : { email: address };
    const result = await client.auth.signInWithOtp(payload);
    if (result?.error) throw result.error;
    return { ok: true, email: address };
  }

  async function signOut() {
    if (!client?.auth?.signOut) return { ok: true };
    const result = await client.auth.signOut();
    if (result?.error) throw result.error;
    setState({ session: null, user: null, error: "", ready: true });
    return { ok: true };
  }

  globalThis.BinoCartAuth = {
    init,
    getState: snapshot,
    getConfig,
    isConfigured: function () {
      const config = getConfig();
      return Boolean(config.url && config.anonKey);
    },
    setConfig,
    clearConfig,
    signInWithOtp,
    signOut
  };

  init();
})();
