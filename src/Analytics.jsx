import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { ResponsiveContainer, RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Bell, UserCircle, Menu } from "lucide-react";

const AnalyticsManager = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [productivityView, setProductivityView] = useState("Equipo");
  const [selectedSprint, setSelectedSprint] = useState("Sprint1");

  const sprints = [
    { name: "Sprint1", date: "May 25, 2023", status: "Completed", progress: 100 },
    { name: "Sprint2", date: "Jun 20, 2023", status: "Doing", progress: 75 },
    { name: "Sprint3", date: "July 13, 2023", status: "Doing", progress: 5 },
    { name: "Sprint4", date: "Dec 20, 2023", status: "Pending", progress: 0 },
    { name: "Sprint5", date: "Mar 15, 2024", status: "Pending", progress: 0 },
  ];

  const tasksToday = [
    { name: "Task1", sprint: "Sprint1", estimatedhours: 15, realhours: 10, status: "Pending", user: "Developer" },
    { name: "Task2", sprint: "Sprint1", estimatedhours: 15, realhours: 10, status: "Pending", user: "Developer" },
    { name: "Task3", sprint: "Sprint2", estimatedhours: 15, realhours: 10, status: "Pending", user: "Developer" },
    { name: "Task4", sprint: "Sprint3", estimatedhours: 15, realhours: 10, status: "Pending", user: "Developer" },
    { name: "Task5", sprint: "Sprint1", estimatedhours: 15, realhours: 10, status: "Done", user: "Developer" },
  ];

  const kpiTeam = [
    { sprint: "Sprint1", hours: 120, tasks: 15 },
    { sprint: "Sprint2", hours: 100, tasks: 10 },
    { sprint: "Sprint3", hours: 130, tasks: 20 },
    { sprint: "Sprint4", hours: 130, tasks: 20 },
  ];

  const kpiPerson = [
    { name: "Daniela Balderas", sprint: "Sprint1", hours: 40, tasks: 5 },
    { name: "Rodrigo Aguilar", sprint: "Sprint1", hours: 20, tasks: 4 },
    { name: "Carlos Saldaña", sprint: "Sprint2", hours: 10, tasks: 6 },
    { name: "Dora Garcia", sprint: "Sprint1", hours: 30, tasks: 4 },
  ];

  const sprintTasks = tasksToday.filter(task => task.sprint === selectedSprint);
  const filteredTasks = selectedFilter === "ALL"
    ? sprintTasks
    : sprintTasks.filter((task) =>
        selectedFilter === "Completed"
          ? task.status === "Done"
          : task.status === "Pending"
      );

  const sprintKpiTeam = kpiTeam.find(k => k.sprint === selectedSprint);
  const sprintKpiPerson = kpiPerson.filter(k => k.sprint === selectedSprint);

  const kpiPersonAggregated = sprintKpiPerson.reduce((acc, cur) => {
    const key = cur.name;
    if (!acc[key]) acc[key] = { name: cur.name, hours: 0, tasks: 0 };
    acc[key].hours += cur.hours;
    acc[key].tasks += cur.tasks;
    return acc;
  }, {});

  const kpiPersonData = Object.values(kpiPersonAggregated);

  const progress = Math.round(
    (sprintTasks.filter((task) => task.status === "Done").length / sprintTasks.length) * 100 || 0
  );

  const sprintOptions = [...new Set(tasksToday.map(task => task.sprint))];


  return (
    <div className="flex h-screen bg-[#1a1a1a]">
      <Sidebar isMobileOpen={isMobileOpen} closeMobile={() => setIsMobileOpen(false)} />
      <div className="flex-1 p-6 overflow-y-auto text-white">
      <header className="flex flex-wrap items-center justify-between py-4 gap-4">
                  <h1 className="text-white text-2xl font-semibold">Analytics</h1>
                  <div className="flex flex-wrap gap-3 items-center">
                  <button className="bg-[#2a2a2a] border rounded px-4 py-2 shadow">Select a Project</button>
                  <select
                    value={selectedSprint}
                    onChange={(e) => setSelectedSprint(e.target.value)}
                    className="bg-[#2a2a2a] border text-white rounded px-4 py-2 shadow"
                  >
                    {sprints.map((s, i) => (
                      <option key={i} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                    <div className="flex items-center gap-3">
                      <Bell className="text-white cursor-pointer hover:text-red-500" />
                      <UserCircle className="text-white w-8 h-8 cursor-pointer hover:text-red-500" />
                    </div>
                  </div>
        </header>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#2a2a2a] rounded p-4 text-center">
            <p className="text-sm text-gray-400">Sprints Done</p>
            <h2 className="text-2xl font-bold">1 / 5 Sprints</h2>
          </div>
          <div className="bg-[#2a2a2a] rounded p-4 text-center">
            <p className="text-sm text-gray-400">Story Points</p>
            <h2 className="text-2xl font-bold">50 / 150 SP</h2>
          </div>
          <div className="bg-[#2a2a2a] rounded p-4 text-center">
            <p className="text-sm text-gray-400">Tasks Done</p>
            <h2 className="text-2xl font-bold">{sprintTasks.filter(t => t.status === "Done").length} / {sprintTasks.length}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-[#2a2a2a] rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Sprint Summary</h3>
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-1">Name</th>
                  <th className="text-left py-1">Due date</th>
                  <th className="text-left py-1">Status</th>
                  <th className="text-left py-1">Progress</th>
                </tr>
              </thead>
              <tbody>
                {sprints.map((sprint, i) => (
                  <tr key={i} className="border-t border-neutral-700">
                    <td className="py-2">{sprint.name}</td>
                    <td className="py-2">{sprint.date}</td>
                    <td className="py-2 text-yellow-400">{sprint.status}</td>
                    <td className="py-2">
                      <div className="bg-neutral-800 w-full h-2 rounded-full">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${sprint.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 ml-1">{sprint.progress}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#2a2a2a] rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Overall Progress</h3>
            <div className="w-full flex items-center justify-center mb-4 relative">
              <ResponsiveContainer width="100%" height={120}>
                <RadialBarChart
                  innerRadius="70%"
                  outerRadius="100%"
                  barSize={10}
                  data={[{ name: "Progress", value: progress, fill: "#22c55e" }]}
                >
                  <RadialBar
                    minAngle={15}
                    background
                    clockWise
                    dataKey="value"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <span className="absolute text-xl font-bold text-white">{progress}%</span>
            </div>
            <p className="mt-2 text-sm text-gray-300">{sprintTasks.length} Total tasks</p>
            <div className="flex justify-center gap-6 mt-2 text-sm">
              <span className="text-green-500">{sprintTasks.filter(t => t.status === "Done").length} Completed</span>
              <span className="text-yellow-400">{sprintTasks.filter(t => t.status === "Doing").length} Doing</span>
              <span className="text-red-400">{sprintTasks.filter(t => t.status === "Pending").length} Pending</span>
            </div>
          </div>
        </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    <div className="bg-[#2a2a2a] rounded p-4">
        <h3 className="text-lg font-semibold mb-4">Sprint's Tasks</h3>
        <div className="flex gap-4 mb-4 text-sm text-gray-400">
        {['ALL', 'Completed', 'Pending'].map(filter => (
            <span
            key={filter}
            className={`cursor-pointer ${selectedFilter === filter ? 'text-white font-semibold underline' : ''}`}
            onClick={() => setSelectedFilter(filter)}
            >
            {filter === 'ALL' ? 'ALL ' + sprintTasks.length :
                filter === 'Completed' ? 'Completed ' + sprintTasks.filter(t => t.status === 'Done').length :
                'Pending ' + sprintTasks.filter(t => t.status === 'Pending').length}
            </span>
        ))}
        </div>
        <table className="w-full text-sm">
        <thead className="text-gray-400">
            <tr>
            <th className="text-left py-1">Task</th>
            <th className="text-left py-1">Estimated hours</th>
            <th className="text-left py-1">Real hours</th>
            <th className="text-left py-1">State</th>
            <th className="text-left py-1">Developer</th>
            </tr>
        </thead>
        <tbody>
            {filteredTasks.map((task, i) => (
            <tr key={i} className="border-t border-neutral-700">
                <td className="py-2">{task.name}</td>
                <td className="py-2">{task.estimatedhours}</td>
                <td className="py-2">{task.realhours}</td>
                <td className="py-2">
                <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    task.status === "Done"
                        ? "bg-green-500 text-white"
                        : task.status === "Pending"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-400 text-black"
                    }`}
                >
                    {task.status}
                </span>
                </td>
                <td className="py-2 text-sm text-gray-300">{task.user}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>

          <div className="bg-[#2a2a2a] rounded p-4 ">
          <h3 className="text-lg font-semibold mb-4">Productivity</h3>
          <div className="text-sm text-gray-400 mb-4">
            <label className="mr-2">See productivity by:</label>
            <select
              value={productivityView}
              onChange={(e) => setProductivityView(e.target.value)}
              className="bg-[#1a1a1a] text-white border border-neutral-600 rounded px-2 py-1"
            >
              <option value="Equipo">Team</option>
              <option value="Persona">Developer</option>
            </select>
          </div>

          {productivityView === "Equipo" ? (
            <>
              <table className="w-full text-sm mb-6">
                <thead className="text-gray-400">
                  <tr>
                    <th className="text-left py-1">Worked hours</th>
                    <th className="text-left py-1">Completed tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {[sprintKpiTeam].map((item, i) => (
                    <tr key={i} className="border-t border-neutral-700">
                      <td className="py-2">{item.hours} hrs</td>
                      <td className="py-2">{item.tasks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="w-full flex items-center justify-center mb-4 relative">
              <ResponsiveContainer width="80%" height={200}>
                <BarChart data={[sprintKpiTeam]} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                  <XAxis dataKey="sprint" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#c54534" name="Worked hours" />
                  <Bar dataKey="tasks" fill="#a9312c" name="Completed tasks" />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </>
          ) : (
            <>
              <table className="w-full text-sm mb-6">
                <thead className="text-gray-400">
                  <tr>
                    <th className="text-left py-1">Developer</th>
                    <th className="text-left py-1">Worked hours</th>
                    <th className="text-left py-1">Completed tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {sprintKpiPerson.map((item, i) => (
                    <tr key={i} className="border-t border-neutral-700">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2">{item.hours} hrs</td>
                      <td className="py-2">{item.tasks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="w-full flex items-center justify-center mb-4 relative">
              <ResponsiveContainer width="90%" height={200}>
                <BarChart data={kpiPersonData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#c54534" name="Worked hours" />
                  <Bar dataKey="tasks" fill="#a9312c" name="Completed tasks" />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </>
          )}
        
        </div>
      </div>
    </div>
    </div>
  );
};

export default AnalyticsManager;
