import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  todosArray: [],
};

export const todoSlice = createSlice({
  name: "todoslicing_in_redux",
  initialState,
  //reducers means adding functionallities
  reducers: {
    //here we are giving refernce only
    addToDo: (state, action) => {
      console.log(action.payload, "payload");
      //state means values of todoarray
      //action means arguments passing in the addtodo function
      const todo = {
        id: nanoid(), //genersting unique id
        msg: action.payload, //in the function which are writing in the argument
      };
      state.todosArray.push(todo);
    },
    deleteTodo: (state, action) => {
      console.log("TESTING IN DEL");
      console.log(action.payload, "payload");
      state.todosArray = state.todosArray.filter(
        (todo) => todo.id !== action.payload
      );
    },
    updateTodo: (state, action) => {
      // Find the index of the todo item in state.todosArray
      // const index = state.todosArray.findIndex(item => item.id === action.payload.id);
      // // If the todo item is found, update its msg
      // console.log();
      // console.log("index",index);
      state.todosArray = state.todosArray.filter(
        (todo) => todo.id == action.payload
      );
      console.log("updating", state.todosArray);
      
    },
  },
});

//exporting the functions seperately to  use them in other files
export const { addToDo, deleteTodo, updateTodo } = todoSlice.actions;

//giving awarness to Store
//expoerting all functions to store

export const todoReducer = todoSlice.reducer;
