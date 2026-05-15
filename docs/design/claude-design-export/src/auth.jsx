// Login + Register screens. Role-aware register.

const Login = ({ onSubmit, onRegister, onHome }) => {
  const [showPw, setShowPw] = React.useState(false);
  return (
    <div className="auth-wrap" data-screen-label="Public · Login">
      <div className="auth-card">
        <span className="auth-back" onClick={onHome}>
          <IconChevL size={14} /> Back to home
        </span>
        <div className="row gap-12 mb-24">
          <div className="brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M12 3s5 5 5 9a5 5 0 1 1-10 0c0-4 5-9 5-9z" fill="#fff" />
            </svg>
          </div>
          <div className="stack">
            <h2 className="auth-title">Welcome back</h2>
            <div className="subtle" style={{ fontSize: 13 }}>
              Sign in to your CarWash Pro account.
            </div>
          </div>
        </div>

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(new FormData(e.target));
          }}
        >
          <Field label="Email">
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              defaultValue="marcus@example.com"
              icon={<IconMail size={16} />}
            />
          </Field>
          <Field label="Password">
            <div className="input-with-icon">
              <IconLock size={16} />
              <input
                name="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                defaultValue="demo1234"
                className="input"
                style={{ paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted)",
                  padding: 6,
                  borderRadius: 6,
                }}
                aria-label="Toggle password visibility"
              >
                <IconEye size={16} />
              </button>
            </div>
          </Field>

          <div className="row-between" style={{ fontSize: 13 }}>
            <label className="row gap-8" style={{ cursor: "pointer" }}>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <a style={{ cursor: "pointer", color: "var(--ink)" }}>Forgot password?</a>
          </div>

          <Button block size="lg" type="submit">
            Sign in
          </Button>
        </form>

        <div className="auth-foot">
          New to CarWash Pro? <a onClick={onRegister}>Create an account</a>
        </div>
      </div>
    </div>
  );
};

const Register = ({ initialRole = "customer", onSubmit, onLogin, onHome }) => {
  const [role, setRole] = React.useState(initialRole);
  return (
    <div className="auth-wrap" data-screen-label="Public · Register">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <span className="auth-back" onClick={onHome}>
          <IconChevL size={14} /> Back to home
        </span>
        <h2 className="auth-title">Create your account</h2>
        <div className="subtle" style={{ fontSize: 13, marginBottom: 18 }}>
          {role === "customer"
            ? "Book washes and manage your vehicles."
            : "Join CarWash Pro and start receiving assigned jobs."}
        </div>

        <div className="pill-toggle mb-24">
          <button
            className={role === "customer" ? "active" : ""}
            onClick={() => setRole("customer")}
          >
            Client
          </button>
          <button
            className={role === "employee" ? "active" : ""}
            onClick={() => setRole("employee")}
          >
            Car washer
          </button>
        </div>

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(role, new FormData(e.target));
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="First name">
              <Input name="first" placeholder="Marcus" defaultValue="Marcus" />
            </Field>
            <Field label="Last name">
              <Input name="last" placeholder="Reyes" defaultValue="Reyes" />
            </Field>
          </div>
          <Field label="Email">
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={<IconMail size={16} />}
            />
          </Field>
          <Field label="Phone">
            <Input name="phone" placeholder="(555) 010-1944" icon={<IconPhone size={16} />} />
          </Field>
          {role === "employee" && (
            <Field label="Shop / referral code" hint="If you're joining a partner shop.">
              <Input name="shop" placeholder="SHOP-2841" />
            </Field>
          )}
          <Field label="Password">
            <Input
              name="password"
              type="password"
              placeholder="At least 8 characters"
              icon={<IconLock size={16} />}
            />
          </Field>

          <label
            className="row gap-8"
            style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}
          >
            <input type="checkbox" defaultChecked />
            I agree to the Terms and Privacy Policy
          </label>

          <Button block size="lg" type="submit">
            Create {role === "customer" ? "client" : "washer"} account
          </Button>
        </form>

        <div className="auth-foot">
          Already have an account? <a onClick={onLogin}>Sign in</a>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Login, Register });
