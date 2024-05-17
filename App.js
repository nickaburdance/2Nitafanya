import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import useFetch from "./hook/useFetch";
import { SIZES, COLORS } from "./constants";

const App = () => {
  const { data, isLoading, error, refetch } = useFetch();
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const handleAddTask = async () => {
    if (task) {
      if (editIndex !== -1) {
        // Edit existing task
        try {
          await axios.patch(
            `https://todoapp-backend-reactnative.onrender.com/api/${editIndex}`,
            { task }
          );
          //const updatedTasks = [...tasks];
          //updatedTasks[editIndex] = task;
          //setTasks(updatedTasks);
          setEditIndex(-1);
          refetch();
        } catch (error) {
          console.error("Error updating task:", error);
          alert("Failed to update task");
        }

      } else {
        // Add new task
        setTasks([...tasks, task]);
        try {
          await axios.post(
            "https://todoapp-backend-reactnative.onrender.com/api/create",
            { task }
          );
          refetch()
        } catch (error) {
          console.error("Error creating task:", error);
          alert("Failed to create task");
        }
      }
      setTask("");
    }
  };

  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setTask(index.task);
    setEditIndex(index._id);
  };

  const handleDeleteTask = async(index) => {
    await axios.delete(`https://todoapp-backend-reactnative.onrender.com/api/${index._id}`)
    refetch();
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.task}>
      <Text style={styles.itemList}>{item.task}</Text>
      <View style={styles.taskButtons}>
        <TouchableOpacity onPress={() => handleEditTask(item)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(item)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Nitafanya App</Text>
      <Text style={styles.title}>ToDo App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        value={task}
        onChangeText={(text) => setTask(text)}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>
          {editIndex !== -1 ? "Update Task" : "Add Task"}
        </Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator size={SIZES.large} color={COLORS.primary} />
      ) : error ? (
        <Text>Something went wrong</Text>
      ) : (
        <View>
          <Text style={styles.title}>Available Tasks</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 7,
    color: "green",
  },
  input: {
    borderWidth: 3,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  addButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    fontSize: 18,
  },
  itemList: {
    fontSize: 19,
  },
  taskButtons: {
    flexDirection: "row",
  },
  editButton: {
    marginRight: 10,
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default App;
