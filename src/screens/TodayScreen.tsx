import {supabase} from "@/lib/supabase";
import {useState, useEffect} from "react";
import {View, Text, TextInput, Button, FlatList} from "react-native";

interface Todo {
  id: number;
  user_id: string;
  title: string;
  description: string;
  completed: boolean;
  due_date: string;
  reminder_time: string;
  created_at: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({title: "", description: ""});
  const userId = "e7411371-0acc-4507-a28d-13ca41eeacac";

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const {data, error} = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      console.error("Error fetching todos:", error.message);
    } else if (data !== null) {
      setTodos(data as Todo[]);
    } else {
      console.log("No todos found.");
    }
  };

  const addTodo = async () => {
    if (newTodo.title.trim() !== "") {
      const {data, error} = await supabase.from("todos").insert([
        {
          user_id: userId,
          title: newTodo.title,
          description: newTodo.description,
          completed: false,
          due_date: null,
          reminder_time: null,
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) {
        console.error("Error adding todo:", error.message);
      } else if (data !== null) {
        setTodos([...todos, data[0] as Todo]);
        setNewTodo({title: "", description: ""});
      } else {
        console.log("Failed to add todo.");
      }
    }
  };

  const toggleTodo = async (todo: Todo) => {
    const {data, error} = await supabase
      .from("todos")
      .update({completed: !todo.completed})
      .eq("id", todo.id)
      .eq("user_id", userId);
    if (error) {
      console.error("Error updating todo:", error.message);
    } else {
      setTodos(
        todos.map(t =>
          t.id === todo.id ? {...t, completed: !t.completed} : t,
        ),
      );
    }
  };

  const deleteTodo = async (todo: Todo) => {
    const {error} = await supabase
      .from("todos")
      .delete()
      .eq("id", todo.id)
      .eq("user_id", userId);
    if (error) {
      console.error("Error deleting todo:", error.message);
    } else {
      setTodos(todos.filter(t => t.id !== todo.id));
    }
  };

  return (
    <View style={{flex: 1, padding: 16}}>
      <View style={{flexDirection: "row", marginBottom: 16}}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginRight: 8,
          }}
          placeholder="Add a new todo"
          value={newTodo.title}
          onChangeText={text => setNewTodo({...newTodo, title: text})}
        />
        <Button title="Add" onPress={addTodo} />
      </View>
      <FlatList
        data={todos}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 8,
            }}>
            <Text
              style={{
                flex: 1,
                textDecorationLine: item.completed ? "line-through" : "none",
              }}>
              {item.title}
            </Text>
            <Button
              title={item.completed ? "Undo" : "Done"}
              onPress={() => toggleTodo(item)}
            />
            <Button title="Delete" onPress={() => deleteTodo(item)} />
          </View>
        )}
      />
    </View>
  );
};

export default TodoList;
