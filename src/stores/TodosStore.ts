import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { useAuthorizationStore } from '.';

export interface ITodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const useTodosStore = defineStore('TodosStore', () => {
  const authorizationStore = useAuthorizationStore();
  const todos = ref<ITodo[] | null>(null);
  const isLoading = ref<boolean>(false);

  const fetchTodos = async () => {
    try {
      isLoading.value = true;

      const response = await fetch(
        `${import.meta.env.VITE_HOST}/users/${authorizationStore.user_id}/todos`,
      );

      todos.value = await response.json();
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  };

  const removeToDo = (todoId: number) => {
    if (todos.value) {
      todos.value = todos.value.filter((todo) => {
        return todo.id !== todoId;
      });
    }
  };

  const addToDo = (newTodoInputRef: Ref<HTMLInputElement | null>) => {
    if (newTodoInputRef.value && authorizationStore.user_id) {
      const newTodo: ITodo = {
        userId: authorizationStore.user_id,
        id: todos.value?.length ? todos.value?.length + 1 : 1,
        title: newTodoInputRef.value.value,
        completed: false,
      };

      todos.value?.push(newTodo);

      newTodoInputRef.value.value = '';
      newTodoInputRef.value.focus();
    }
  };

  return {
    todos,
    isLoading,
    fetchTodos,
    removeToDo,
    addToDo,
  };
});