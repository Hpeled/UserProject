import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useNavigate,
  Link
} from "react-router-dom";


const UserDetails = ({ users, updateUserName }) => {
  const { userId } = useParams();
  const [newName, setNewName] = useState("");
  const [userIndex, setUserIndex] = useState(-1);

  useEffect(() => {
    const index = users.findIndex((user) => user.id === userId);
    setUserIndex(index);
  }, [users, userId]);

  useEffect(() => {
    if (userIndex === -1) {
      return;
    }
    setNewName(`${users[userIndex].firstName} ${users[userIndex].lastName}`);
  }, [userIndex, users]);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleClick = () => {
    const username = newName.split(" ");
    updateUserName(username[0], username[1], userIndex);
  };

  console.log(newName);
  return userIndex === -1 ? (
    <h1>User Does not existuseNavigate s!</h1>
  ) : (
    <div>
      <img src={users[userIndex].picture} alt={users[userIndex].firstName} />
      <input onChange={handleNameChange} value={newName} />
      <Button onClick={handleClick}>Change Name</Button>
    </div>
  );
};

const UsersList = ({ users, loading, updateUsers }) => {
  const { page } = useParams();
  const navigate = useNavigate();

  const [selectedUsers, setSelectedUsers] = useState([]);

  const nextPage = () => {
    const nextPage = +page + 1;
    if (nextPage === 5) {
      return navigate("/1");
    }
    navigate("/" + nextPage);
  };

  const prevPage = () => {
    const prevPage = +page - 1;
    if (prevPage === 0) {
      return navigate("/1");
    }
    navigate("/" + prevPage);
  };

  const deleteHandler = () => {
    const usersArr = [...users];
    for (let i = 0; i < selectedUsers.length; i++) {
      const userId = selectedUsers[i];
      const userIndex = usersArr.findIndex((user) => userId === user.id);
      usersArr.splice(userIndex, 1);
    }
    updateUsers(usersArr);
  };

  const handleChange = (val) => {
    setSelectedUsers(val);
  };

  const getPageUsers = () => {
    const limit = 6;
    const startIndex = page * limit - limit;
    const endIndex = startIndex + limit;
    return users.slice(startIndex, endIndex);
  };

  const pageUsers = getPageUsers();
  console.log(users);
  return (
    <div className="d-flex flex-column">
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <ToggleButtonGroup
          type="checkbox"
          value={selectedUsers}
          onChange={handleChange}
        >
          {pageUsers.map((user, index) => (
            <ToggleButton key={user.id} value={user.id}>
              <Link className="p-2 text-success" to={"/user/" + user.id}>
                {user.firstName}
              </Link>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
      <Button className="m-2" onClick={prevPage}>
        Previous Page
      </Button>
      <Button className="m-2" onClick={nextPage}>
        Next Page
      </Button>
      <Button className="m-2" onClick={deleteHandler}>
        Delete
      </Button>
    </div>
  );
};
//https://dummyapi.io/data/v1/user?limit=20
const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const localData = localStorage.getItem("USERSDATA");
      if (localData) {
        return setUsers(JSON.parse(localData));
      }
      const response = await fetch(
        "https://dummyapi.io/data/v1/user?limit=20",
        {
          headers: {
            "app-id": "623360b66aac176e3fac105a"
          }
        }
      );
      const userData = await response.json();
      setLoading(true);
      localStorage.setItem("USERSDATA", JSON.stringify(userData.data));
      setUsers(userData.data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const updateUsers = (newUsers) => {
    setUsers(newUsers);
  };

  const updateUserName = (first, last, index) => {
    const usersArr = [...users];
    const newUser = {
      ...usersArr[index],
      firstName: first,
      lastName: last
    };
    usersArr.splice(index, 1, newUser);
    setUsers(usersArr);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/:page"
          element={
            <UsersList
              users={users}
              loading={loading}
              updateUsers={updateUsers}
            />
          }
        />
        userId
        <Route
          path="/user/:userId"
          element={
            <UserDetails users={users} updateUserName={updateUserName} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
