import React from "react";

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="w-full bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Dashboard Navbar</h1>
      </nav>

      {/* Main Content Area */}
      <main className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 sticky top-0 h-screen bg-gray-200 p-4">
          <h2 className="font-semibold mb-2">Sidebar</h2>
          <ul className="space-y-2">
            <li>Dashboard</li>
            <li>Settings</li>
            <li>Profile</li>
          </ul>
        </aside>

        {/* Content */}
        <section className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold mb-4">Main Content</h2>
            {/* Long content for scrolling */}
            {[...Array(20)].map((_, i) => (
              <p key={i} className="bg-white p-4 rounded shadow">
                This is a scrollable content section. Paragraph {i + 1}
              </p>
            ))}
          </div>

          {/* Footer (visible after content ends) */}
          <footer className="mt-10 bg-gray-800 text-white p-4 rounded">
            <p>Footer Content</p>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
