import React, { useEffect, useState } from "react";

const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todo, setTodo] = useState([]);
  const [errors, setError] = useState("");
  const [success, setMessage] = useState("");
  const api = "http://localhost:8080";

  //Create todo item function
  async function handleSubmit() {
    if (title.trim() !== "" && description.trim() !== "") {
      await fetch(api + "/todo", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      }).then((res) => {
        if (res.ok) {
          setTodo([...todo, { title, description }]);
          console.log(todo);

          setMessage("Item added successfully");
          setTitle("");
          setDescription("");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        } else {
          setError("Unable to add Item");
          setTimeout(() => {
            setError("");
          }, 3000);
        }
      });
    }
  }

  //Delete todo item function

  async function handleDelete(id) {
    await fetch(`${api}/todo/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        setTodo(todo.filter((item) => item._id !== id));
        setMessage("Item deleted successfully");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setError("Unable to delete Item");
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    });
  }

  useEffect(()=>{
    getItems();
  },[])
  
  const getItems = () => {
    fetch(api + "/todo")
      .then((res) => res.json())
      .then((res) => {
        setTodo(res);
      });
  };

  return (
    <>
      <div className="bg-slate-900 mx-auto overflow-y-scroll  overflow-hidden h-screen w-screen ">
        <div className="container">
          <header className="text-gray-300 text-3xl font-bold mb-16">
            Todo App Using MERN
          </header>
        </div>

        <input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          type="text"
          name="title"
          value={title}
          placeholder="Enter title"
          className="px-12 outline-none  m-4 py-2 rounded-lg"
        />
        <input
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          type="text"
          name="text"
          value={description}
          placeholder="Enter Description"
          className="px-28 outline-none  m-4 py-2 rounded-lg"
        />

        <button
          onClick={() => {
            handleSubmit();
          }}
          type="submit"
          className="bg-purple-600 px-4 py-2 font-medium rounded-lg text-white hover:bg-purple-700"
        >
          Add
        </button>
        {success && (
          <p className="text-green-500 text-lg font-normal">{success}</p>
        )}
        {errors && <p className="text-red-500 text-lg font-normal">{errors}</p>}

        {todo.map((todos) => {
          return (
            <div className="flex justify-between bg-white p-6 m-2 rounded-lg">
              <div>
                <h1 className="flex text-start text-2xl font-bold text-black">
                  {todos.title}
                </h1>
                <p className="">{todos.description}</p>
              </div>
              <div className="flex gap-4">
                <button className="flex bg-green-600 w-16 h-8 mt-2 px-2 py-1 font-medium rounded-lg text-white hover:bg-green-700">
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(todos._id);
                  }}
                  className="flex bg-red-600 w-16 h-8 mt-2 px-2 py-1 font-medium rounded-lg text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Todo;
