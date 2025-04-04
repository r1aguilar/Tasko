// DashDev.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { Droppable, DragDropContext, Draggable } from "react-beautiful-dnd";
import { Bell, UserCircle, Menu } from "lucide-react";

//const tasksData = {
//  pending: [
//    { id: "1", type: "High", title: "Fix login error", description: "Login fails with wrong token response" },
//  ],
//  doing: [
//    { id: "2", type: "Medium", title: "Implement Kanban UI", description: "Drag and drop cards between columns" },
//  ],
//  done: [
//    { id: "3", type: "Low", title: "Dark theme applied", description: "Oracle dark mode UI setup complete" },
//  ],
//};

const tagColors = {
  High: "bg-red-600",
  Medium: "bg-yellow-500",
  Low: "bg-green-600",
};

const DashDev = () => {
  const [tasks, setTasks] = useState(( { pending: [], doing: [], done: [] }));
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://140.84.190.203/TareasUsuario/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const Tasks = data
        const newTasks = { pending: [], doing: [], done: [] };

        data.forEach((task) => {
          const formattedTask = {
            id: String(task.idTarea),
            type:
              task.prioridad === 1
                ? "Low"
                : task.prioridad === 2
                ? "Medium"
                : "High",
            title: task.nombre,
            description: task.descripcion,
          };

          if (task.idColumna === 1) newTasks.pending.push(formattedTask);
          else if (task.idColumna === 2) newTasks.doing.push(formattedTask);
          else if (task.idColumna === 3) newTasks.done.push(formattedTask);
        });

        setTasks(newTasks);
      })
      .catch((err) => console.error("❌ Error cargando tareas:", err));
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const newSourceTasks = Array.from(tasks[sourceCol]);
    const [removed] = newSourceTasks.splice(source.index, 1);
    const newDestTasks = Array.from(tasks[destCol]);
    newDestTasks.splice(destination.index, 0, removed);

    setTasks({
      ...tasks,
      [sourceCol]: newSourceTasks,
      [destCol]: newDestTasks,
    });
  };

  const progress = Math.round(
    (tasks.done.length /
      (tasks.pending.length + tasks.doing.length + tasks.done.length)) *
      100
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#1a1a1a]">
      {/* Botón solo visible en móvil */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu size={28} />
      </button>


      <Sidebar isMobileOpen={isMobileOpen} closeMobile={() => setIsMobileOpen(false)} />

      <div className="flex-1 px-4 md:px-6 lg:px-8 overflow-y-auto">
      <header className="flex flex-wrap items-center justify-between py-4 gap-4">
      <h1 className="text-white text-2xl font-semibold">Dashboard</h1>
          <div className="flex flex-wrap gap-3 items-center">
            <select className="bg-[#2a2a2a] text-white rounded px-4 py-2 text-sm">
              <option>Select a Project</option>
            </select>
            <select className="bg-[#2a2a2a] text-white rounded px-4 py-2 text-sm">
              <option>All Users</option>
            </select>
            <select className="bg-[#2a2a2a] text-white rounded px-4 py-2 text-sm">
              <option>Sprints</option>
              <option>Sprint 1</option>
              <option>Sprint 2</option>
              <option>Sprint 3</option>
            </select>
            <div className="flex items-center gap-3">
              <Bell className="text-white cursor-pointer hover:text-red-500" />
              <UserCircle className="text-white w-8 h-8 cursor-pointer hover:text-red-500" />
            </div>
          </div>
        </header>

        <DragDropContext onDragEnd={onDragEnd}>
          <main className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Object.entries(tasks).map(([key, items]) => (
              <section
                key={key}
                className="bg-[#2a2a2a] text-white rounded-lg p-4 flex flex-col"
              >
                <h2 className="text-lg font-semibold mb-2 capitalize">
                  {key}
                </h2>
                <Droppable droppableId={key}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3 flex-1"
                    >
                      {items.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="bg-[#1a1a1a] rounded-lg p-4 shadow-md border border-neutral-700"
                            >
                              <span
                                className={`text-xs px-2 py-1 rounded-full text-white ${tagColors[task.type]}`}
                              >
                                {task.type}
                              </span>
                              <h3 className="font-semibold text-white mt-2">
                                {task.title}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {task.description}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </section>
            ))}

            <section className="bg-[#2a2a2a] text-white rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Progress</h2>
              <div className="w-full flex items-center justify-center mb-4">
                <ResponsiveContainer width="100%" height={120}>
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={10}
                    data={[{ name: "Progress", value: progress, fill: "#ff1f1f" }]}
                  >
                    <RadialBar
                      minAngle={15}
                      background
                      clockWise
                      dataKey="value"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <span className="absolute text-xl font-bold text-white">
                  {progress}%
                </span>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tasks Left</h3>
                <ul className="space-y-2">
                  <li className="bg-[#1a1a1a] px-4 py-2 rounded">Today</li>
                  <li className="bg-[#1a1a1a] px-4 py-2 rounded">Tomorrow</li>
                  <li className="bg-[#1a1a1a] px-4 py-2 rounded">Wednesday</li>
                </ul>
              </div>
            </section>
          </main>
        </DragDropContext>
      </div>
    </div>
  );
};

export default DashDev;