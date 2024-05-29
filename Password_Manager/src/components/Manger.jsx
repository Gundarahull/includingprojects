import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Manger = () => {
  // bg-green-100
  const [passwordArray, setPasswordArray] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [editItemId, setEditItemId] = useState(null); //for Editing

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch("http://localhost:8000"); 
        let data = await response.json();
        console.log(data);
        setPasswordArray(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [fetchTrigger]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue, //to sset the vaues in the field
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Submitting form data...", data);
    try {
      let url;
      let method;

      if (editItemId) {
        url = `http://localhost:8000/edit/${editItemId}`;
        method = "PUT";
      } else {
        url = "http://localhost:8000/post";
        method = "POST";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Response data:", responseData);
      reset();
      toast.success("SAVED");
      setEditItemId(null);

      // Trigger re-fetch of data
      setFetchTrigger((prev) => !prev); 
    } catch (error) {
      console.error("Error submitting form data:", error);
      toast.error("Failed to save data");
    }
  };
  const handleDelete = async (item_id) => {
    console.log("Deleting item with id:", item_id);
    try {
      const response = await fetch(`http://localhost:8000/delete/${item_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log("Deleted data:", responseData);
      setFetchTrigger((prev) => !prev);
      toast.success("Deleted Successfully");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleEdit = (item) => {
    console.log("Editing item with id:", item);
    setValue("sitename", item.sitename);
    setValue("username", item.username);
    setValue("password", item.password);

    setEditItemId(item._id);
  };

  const copyText = (copied) => {
    toast.success("Copied to CLipBOARD", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    console.log("copies text", copied);
    navigator.clipboard.writeText(copied);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      {/* Same as */}
      <ToastContainer />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-100 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="container mycontainer">
        <h1 className="text-4xl text font-bold text-center">
          <span className="text-green-500"> &lt;</span>

          <span>Pass</span>
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center">
          Your own Password Manager
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-black flex flex-col p-4 gap-3 items-center">
            <input
              className="rounded-lg border border-green-500 w-full p-4 py-1"
              placeholder="Enter website URL"
              type="text"
              {...register("sitename")}
            />
            <div className="flex w-full justify-between gap-10">
              <input
                className="rounded-lg border border-green-500 w-full p-4 py-1"
                placeholder="Enter Username"
                type="text"
                {...register("username")}
              />
              <div className="relative">
                <input
                  placeholder="Enter Password"
                  className="rounded-full border border-green-500 w-full p-4 py-1"
                  type="password"
                  {...register("password")}
                />
                <span className="absolute right-[3px] top-[4px] cursor-pointer">
                </span>
              </div>
            </div>
            <button
              className="flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900"
              type="submit"
            >
              <lord-icon
                src="https://cdn.lordicon.com/jgnvfzqg.json"
                trigger="hover"
              ></lord-icon>
              Save
            </button>
          </div>
        </form>

        <div className="passwords">
          <h2 className="text-2xl bold py-4">Your Passwords</h2>
          <table className="table-auto w-full rounded-md overflow-hidden">
            <thead className=" bg-green-800 text-white">
              <tr>
                <th className="py-2">SiteName</th>
                <th className="py-2">UserName</th>
                <th className="py-2">Password</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-green-100">
              {passwordArray.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="py-2 border border-white text-center">
                      <div className="flex items-center justify-center ">
                        <a href={item.sitename} target="_blank">
                          {item.sitename}
                        </a>
                        <div
                          className="lordiconcopy size-7 cursor-pointer"
                          onClick={() => {
                            copyText(item.sitename);
                          }}
                        >
                          <lord-icon
                            style={{
                              width: "25px",
                              height: "25px",
                              paddingTop: "3px",
                              paddingLeft: "3px",
                            }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover"
                          ></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 border border-white text-center">
                      <div className="flex items-center justify-center ">
                        <span>{item.username}</span>
                        <div
                          className="lordiconcopy size-7 cursor-pointer"
                          onClick={() => {
                            copyText(item.username);
                          }}
                        >
                          <lord-icon
                            style={{
                              width: "25px",
                              height: "25px",
                              paddingTop: "3px",
                              paddingLeft: "3px",
                            }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover"
                          ></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 border border-white text-center">
                      <div className="flex items-center justify-center ">
                        <span>{"*".repeat(item.password.length)}</span>
                        <div
                          className="lordiconcopy size-7 cursor-pointer"
                          onClick={() => {
                            copyText(item.password);
                          }}
                        >
                          <lord-icon
                            style={{
                              width: "25px",
                              height: "25px",
                              paddingTop: "3px",
                              paddingLeft: "3px",
                            }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover"
                          ></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className="justify-center py-2 border border-white text-center">
                      <span
                        className="cursor-pointer mx-1"
                        onClick={() => handleEdit(item)}
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/gwlusjdu.json"
                          trigger="hover"
                          style={{ width: "25px", height: "25px" }}
                        ></lord-icon>
                      </span>
                      <span
                        className="cursor-pointer mx-1"
                        onClick={() => handleDelete(item._id)}
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/skkahier.json"
                          trigger="hover"
                          style={{ width: "25px", height: "25px" }}
                        ></lord-icon>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Manger;
