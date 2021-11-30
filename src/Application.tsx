import { useState } from "react";
import "./Application.css";

enum Mode {
  Create = 0,
  Edit = 1,
}

interface Task {
  title: string;
  description: string;
}

const maxTitleLength = 40;
const maxDescriptionLength = 120;

function Application(): JSX.Element {
  const [mode, setMode] = useState<Mode>(Mode.Create);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [previousTaskTitle, setPreviousTaskTitle] = useState<string>("");
  const [previousTaskDescription, setPreviousTaskDescription] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const alertOnCondition = (condition: boolean, alertMessage: string) => {
    if (condition) alert(alertMessage);
    return condition;
  };

  const validateFields = (title: string, description: string): boolean => {
    if (alertOnCondition(title.length === 0, "Title can not be empty.")) return false;
    if (alertOnCondition(title.length > maxTitleLength, `Title should be no longer than ${maxTitleLength} symbols.`)) return false;
    if (alertOnCondition(description.length === 0, "Description can not be empty.")) return false;
    if (alertOnCondition(description.length > maxDescriptionLength, `Description should be no longer than ${maxDescriptionLength} symbols.`)) return false;
    return true;
  };

  const createTask = (title: string, description: string): void => {
    title = title.trim();
    description = description.trim();
    if (validateFields(title, description)) {
      setTaskTitle("");
      setTaskDescription("");
      setTasks([...tasks, { title: title, description: description }]);
    }
  };

  const beginEditTask = (task: Task): void => {
    setMode(Mode.Edit);
    setPreviousTaskTitle(taskTitle);
    setPreviousTaskDescription(taskDescription);
    setTaskToEdit(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
  };

  const endEditTask = (title: string, description: string): void => {
    title = title.trim();
    description = description.trim();
    if (taskToEdit && validateFields(title, description)) {
      taskToEdit.title = title;
      taskToEdit.description = description;
    }
    completeEditTask();
  };

  const completeEditTask = (): void => {
    setMode(Mode.Create);
    setTaskTitle(previousTaskTitle);
    setTaskDescription(previousTaskDescription);
    setPreviousTaskTitle("");
    setPreviousTaskDescription("");
    setTaskToEdit(null);
  };

  const deleteTask = (task: Task): void => {
    if (taskToEdit && taskToEdit === task) completeEditTask();
    setTasks(tasks.filter((taskToCompare) => taskToCompare !== task));
  };

  return (
    <div className="application">
      <h1>Task Scheduler Application</h1>
      <div>
        <h2>{`${mode === Mode.Create ? "Create" : "Edit"}`} Task:</h2>
        <div>
          Task Title:&nbsp;
          <input type="text" size={maxTitleLength} placeholder="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
        </div>
        <div>
          Task Description:&nbsp;
          <input
            type="text"
            size={maxDescriptionLength}
            placeholder="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </div>
        <div>
          {mode === Mode.Create ? (
            <input type="button" value="Create" onClick={() => createTask(taskTitle, taskDescription)} />
          ) : (
            <>
              <input type="button" value="Save" onClick={() => endEditTask(taskTitle, taskDescription)} />
              <input type="button" value="Cancel" onClick={() => completeEditTask()} />
            </>
          )}
        </div>
      </div>
      <div>
        <h2>Existing Tasks:</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <input type="button" value="Edit" onClick={() => beginEditTask(task)} />
                  <input type="button" value="Delete" onClick={() => deleteTask(task)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Application;
