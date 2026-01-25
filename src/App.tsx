import "./App.css";
import { Users } from "./components/Users/Users";
import { UsersProvider } from "./store/UsersContext";

function App() {

  return (
      <UsersProvider>
        <main>
          <h1>Search users</h1>
          <Users />
        </main>
      </UsersProvider>
  );
}

export default App;
