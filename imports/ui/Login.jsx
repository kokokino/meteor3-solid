import { createSignal } from "solid-js";
import { Meteor } from "meteor/meteor";

export const Login = () => {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');

  const login = async (event) => {
    event.preventDefault();
    await Meteor.loginWithPassword(username(), password());
  };

  return (
    <form class="login-form" onSubmit={login}>
      <div>
        <label for="username">Username</label>
        <input
          type="text"
          placeholder="Username"
          name="username"
          required
          value={username()}
          onInput={(e) => setUsername(e.currentTarget.value)}
        />
      </div>

      <div>
        <label for="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
        />
      </div>
      <div>
        <button type="submit">Log In</button>
      </div>
    </form>
  );
};