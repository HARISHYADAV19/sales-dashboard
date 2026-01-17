import React, { useState, createContext, useContext, useMemo, memo } from 'react';
import { Users, Phone, Settings, LogOut, X, Eye, Edit2, Save } from 'lucide-react';


// ==================== CONTEXT & STATE MANAGEMENT ====================

const AppContext = createContext();

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

// ==================== MOCK DATA ====================

const MOCK_DATA = {
  'org-a': {
    name: 'TechVision Solutions',
    leads: [
      { id: 1, name: 'Harshit Yadav', phone: '+91 98765 43210', status: 'new', assignedTo: 'Priya Sharma' },
      { id: 2, name: 'Rajesh Kumar', phone: '+91 98765 43211', status: 'contacted', assignedTo: 'Harshit Yadav' },
      { id: 3, name: 'Anita Desai', phone: '+91 98765 43212', status: 'qualified', assignedTo: 'Priya Sharma' },
      { id: 4, name: 'Vikram Singh', phone: '+91 98765 43213', status: 'new', assignedTo: 'Harshit Yadav' },
      { id: 5, name: 'Sneha Patel', phone: '+91 98765 43214', status: 'converted', assignedTo: 'Priya Sharma' },
      { id: 6, name: 'Arjun Mehta', phone: '+91 98765 43215', status: 'contacted', assignedTo: 'Harshit Yadav' },
    ],
    callLogs: [
      { id: 1, leadName: 'Harshit Yadav', date: '2026-01-17', time: '10:30 AM', duration: '5:23', outcome: 'Interested', agent: 'Priya Sharma' },
      { id: 2, leadName: 'Rajesh Kumar', date: '2026-01-17', time: '11:15 AM', duration: '3:45', outcome: 'No Answer', agent: 'Harshit Yadav' },
      { id: 3, leadName: 'Anita Desai', date: '2026-01-16', time: '02:20 PM', duration: '8:12', outcome: 'Qualified', agent: 'Priya Sharma' },
      { id: 4, leadName: 'Vikram Singh', date: '2026-01-16', time: '04:00 PM', duration: '2:30', outcome: 'Not Interested', agent: 'Harshit Yadav' },
      { id: 5, leadName: 'Sneha Patel', date: '2026-01-15', time: '09:45 AM', duration: '12:05', outcome: 'Converted', agent: 'Priya Sharma' },
    ]
  },
  'org-b': {
    name: 'InnovateCorp India',
    leads: [
      { id: 1, name: 'Amit Verma', phone: '+91 98765 54321', status: 'new', assignedTo: 'Kavya Reddy' },
      { id: 2, name: 'Pooja Iyer', phone: '+91 98765 54322', status: 'contacted', assignedTo: 'Rohan Das' },
      { id: 3, name: 'Suresh Nair', phone: '+91 98765 54323', status: 'qualified', assignedTo: 'Kavya Reddy' },
      { id: 4, name: 'Deepa Krishnan', phone: '+91 98765 54324', status: 'new', assignedTo: 'Rohan Das' },
      { id: 5, name: 'Manoj Agarwal', phone: '+91 98765 54325', status: 'lost', assignedTo: 'Kavya Reddy' },
    ],
    callLogs: [
      { id: 1, leadName: 'Amit Verma', date: '2026-01-17', time: '01:00 PM', duration: '4:15', outcome: 'Callback Requested', agent: 'Kavya Reddy' },
      { id: 2, leadName: 'Pooja Iyer', date: '2026-01-16', time: '03:30 PM', duration: '6:40', outcome: 'Interested', agent: 'Rohan Das' },
      { id: 3, leadName: 'Suresh Nair', date: '2026-01-15', time: '11:00 AM', duration: '9:20', outcome: 'Qualified', agent: 'Kavya Reddy' },
    ]
  }
};

const USERS = {
  'harshit@techvision.com': { name: 'Harshit Yadav', role: 'admin', tenant: 'org-a', password: 'admin123' },
  'priya@techvision.com': { name: 'Priya Sharma', role: 'agent', tenant: 'org-a', password: 'agent123' },
  'kavya@innovate.com': { name: 'Kavya Reddy', role: 'admin', tenant: 'org-b', password: 'admin123' },
  'rohan@innovate.com': { name: 'Rohan Das', role: 'agent', tenant: 'org-b', password: 'agent123' },
};

// ==================== STYLES ====================

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Login Page */
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .login-card {
    background: white;
    border-radius: 16px;
    padding: 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }

  .login-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .login-logo {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    color: white;
  }

  .login-title {
    font-size: 24px;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 8px;
  }

  .login-subtitle {
    color: #718096;
    font-size: 14px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }

  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
  }

  .form-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary {
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 14px;
    font-size: 16px;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  .demo-creds {
    margin-top: 24px;
    padding: 16px;
    background: #f7fafc;
    border-radius: 8px;
    font-size: 12px;
  }

  .demo-title {
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }

  .demo-item {
    margin: 4px 0;
    color: #718096;
  }

  .error-message {
    background: #fee;
    color: #c33;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 14px;
  }

  /* Header */
  .header {
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 16px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header-logo {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .header-info h1 {
    font-size: 18px;
    color: #1a202c;
  }

  .tenant-badge {
    display: inline-block;
    padding: 4px 12px;
    background: #e6f3ff;
    color: #0066cc;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    margin-top: 2px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-info {
    text-align: right;
    margin-right: 8px;
  }

  .user-name {
    font-size: 14px;
    font-weight: 600;
    color: #1a202c;
  }

  .role-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .role-admin {
    background: #fef3c7;
    color: #92400e;
  }

  .role-agent {
    background: #dbeafe;
    color: #1e40af;
  }

  .btn-icon {
    padding: 8px;
    background: transparent;
    border: 1px solid #e2e8f0;
    color: #64748b;
  }

  .btn-icon:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  /* Main Layout */
  .main {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* Sidebar */
  .sidebar {
    width: 260px;
    background: white;
    border-right: 1px solid #e2e8f0;
    padding: 24px 0;
  }

  .nav-item {
    padding: 12px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
    border-left: 3px solid transparent;
  }

  .nav-item:hover {
    background: #f8fafc;
    color: #1e293b;
  }

  .nav-item.active {
    background: #f1f5f9;
    color: #667eea;
    border-left-color: #667eea;
    font-weight: 600;
  }

  /* Content */
  .content {
    flex: 1;
    padding: 32px;
    overflow-y: auto;
    background: #f8fafc;
  }

  .page-header {
    margin-bottom: 24px;
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 8px;
  }

  .page-subtitle {
    color: #64748b;
    font-size: 14px;
  }

  /* Filters */
  .filters {
    background: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .filter-row {
    display: flex;
    gap: 16px;
    align-items: flex-end;
  }

  .filter-group {
    flex: 1;
  }

  .filter-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }

  .filter-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
  }

  .filter-select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    cursor: pointer;
  }

  .btn-secondary {
    background: #f1f5f9;
    color: #475569;
  }

  .btn-secondary:hover {
    background: #e2e8f0;
  }

  /* Cards */
  .card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  /* Table */
  .table-container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: #f8fafc;
  }

  th {
    padding: 16px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 16px;
    border-top: 1px solid #e2e8f0;
    font-size: 14px;
    color: #334155;
  }

  tbody tr:hover {
    background: #f8fafc;
  }

  /* Status Badges */
  .status-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
  }

  .status-new {
    background: #e0e7ff;
    color: #4338ca;
  }

  .status-contacted {
    background: #dbeafe;
    color: #1e40af;
  }

  .status-qualified {
    background: #d1fae5;
    color: #065f46;
  }

  .status-converted {
    background: #d1fae5;
    color: #065f46;
  }

  .status-lost {
    background: #fee2e2;
    color: #991b1b;
  }

  /* Outcome Badges */
  .outcome-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .outcome-interested {
    background: #d1fae5;
    color: #065f46;
  }

  .outcome-qualified {
    background: #a7f3d0;
    color: #047857;
  }

  .outcome-converted {
    background: #6ee7b7;
    color: #065f46;
  }

  .outcome-no-answer, .outcome-not-interested {
    background: #fee2e2;
    color: #991b1b;
  }

  .outcome-callback-requested {
    background: #fef3c7;
    color: #92400e;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #94a3b8;
  }

  .empty-icon {
    width: 80px;
    height: 80px;
    background: #f1f5f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 8px;
  }

  /* Settings Page */
  .settings-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .settings-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 16px;
  }

  .settings-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .settings-row:last-child {
    border-bottom: none;
  }

  .settings-info h4 {
    font-size: 14px;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 4px;
  }

  .settings-info p {
    font-size: 13px;
    color: #64748b;
  }

  /* Action Icons */
  .action-icons {
    display: flex;
    gap: 8px;
  }

  .icon-btn {
    padding: 6px;
    background: transparent;
    border: none;
    color: #64748b;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .icon-btn:hover {
    background: #f1f5f9;
    color: #334155;
  }

  .icon-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Edit Mode */
  .edit-input {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
    width: 200px;
  }

  /* Loading State */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Stats Cards */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .stat-label {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #1a202c;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .header {
      padding: 12px 16px;
    }

    .sidebar {
      display: none;
    }

    .content {
      padding: 16px;
    }

    .filter-row {
      flex-direction: column;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// ==================== COMPONENTS ====================

// Login Component
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const user = USERS[email];
    if (!user || user.password !== password) {
      setError('Invalid credentials. Please try again.');
      return;
    }

    onLogin({ email, ...user });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Users size={30} />
          </div>
          <h1 className="login-title">Sales Dashboard</h1>
          <p className="login-subtitle">Multi-tenant CRM Platform</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </form>

        <div className="demo-creds">
          <div className="demo-title">Demo Credentials:</div>
          <div className="demo-item"><strong>Admin (Org A):</strong> harshit@techvision.com / admin123</div>
          <div className="demo-item"><strong>Agent (Org A):</strong> priya@techvision.com / agent123</div>
          <div className="demo-item"><strong>Admin (Org B):</strong> kavya@innovate.com / admin123</div>
          <div className="demo-item"><strong>Agent (Org B):</strong> rohan@innovate.com / agent123</div>
        </div>
      </div>
    </div>
  );
};

// Header Component
const Header = memo(({ user, onLogout }) => {
  const { tenantData } = useAppContext();

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <Users size={20} />
        </div>
        <div className="header-info">
          <h1>{tenantData.name}</h1>
          <span className="tenant-badge">{user.tenant === 'org-a' ? 'Organization A' : 'Organization B'}</span>
        </div>
      </div>
      <div className="header-right">
        <div className="user-info">
          <div className="user-name">{user.name}</div>
          <span className={`role-badge role-${user.role}`}>{user.role}</span>
        </div>
        <button className="btn btn-icon" onClick={onLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
});

// Sidebar Component
const Sidebar = memo(({ activeView, onViewChange }) => {
  return (
    <aside className="sidebar">
      <nav>
        <div
          className={`nav-item ${activeView === 'leads' ? 'active' : ''}`}
          onClick={() => onViewChange('leads')}
        >
          <Users size={20} />
          <span>Leads</span>
        </div>
        <div
          className={`nav-item ${activeView === 'calls' ? 'active' : ''}`}
          onClick={() => onViewChange('calls')}
        >
          <Phone size={20} />
          <span>Call Logs</span>
        </div>
        <div
          className={`nav-item ${activeView === 'settings' ? 'active' : ''}`}
          onClick={() => onViewChange('settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </nav>
    </aside>
  );
});

// Leads Component
const LeadsModule = memo(({ user }) => {
  const { tenantData } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [leads, setLeads] = useState(tenantData.leads);

  const isAdmin = user.role === 'admin';

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      qualified: leads.filter(l => l.status === 'qualified').length,
      converted: leads.filter(l => l.status === 'converted').length,
    };
  }, [leads]);

  const handleEdit = (lead) => {
    setEditingId(lead.id);
    setEditStatus(lead.status);
  };

  const handleSave = (leadId) => {
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: editStatus } : l));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditStatus('');
  };

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Leads Management</h2>
        <p className="page-subtitle">Track and manage your sales leads</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Leads</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">New</div>
          <div className="stat-value">{stats.new}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Contacted</div>
          <div className="stat-value">{stats.contacted}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Converted</div>
          <div className="stat-value">{stats.converted}</div>
        </div>
      </div>

      <div className="filters">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          {searchTerm || statusFilter !== 'all' ? (
            <button className="btn btn-secondary" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
              <X size={16} /> Clear
            </button>
          ) : null}
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          {filteredLeads.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{lead.phone}</td>
                    <td>
                      {editingId === lead.id ? (
                        <select
                          className="edit-input"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      ) : (
                        <span className={`status-badge status-${lead.status}`}>{lead.status}</span>
                      )}
                    </td>
                    <td>{lead.assignedTo}</td>
                    {isAdmin && (
                      <td>
                        <div className="action-icons">
                          {editingId === lead.id ? (
                            <>
                              <button className="icon-btn" onClick={() => handleSave(lead.id)} title="Save">
                                <Save size={16} />
                              </button>
                              <button className="icon-btn" onClick={handleCancel} title="Cancel">
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="icon-btn" onClick={() => handleEdit(lead)} title="Edit">
                                <Edit2 size={16} />
                              </button>
                              <button className="icon-btn" title="View Details">
                                <Eye size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <Users size={40} />
              </div>
              <div className="empty-title">No leads found</div>
              <p>Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

// Call Logs Component
const CallLogsModule = memo(() => {
  const { tenantData } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [callLogs] = useState(tenantData.callLogs);

  const filteredLogs = useMemo(() => {
    return callLogs.filter(log => {
      const matchesSearch = log.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.agent.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !dateFilter || log.date === dateFilter;
      return matchesSearch && matchesDate;
    });
  }, [callLogs, searchTerm, dateFilter]);

  const stats = useMemo(() => {
    const totalDuration = callLogs.reduce((acc, log) => {
      const [min, sec] = log.duration.split(':').map(Number);
      return acc + min * 60 + sec;
    }, 0);
    return {
      total: callLogs.length,
      avgDuration: Math.floor(totalDuration / callLogs.length / 60) + ':' + 
                   String(Math.floor((totalDuration / callLogs.length) % 60)).padStart(2, '0'),
      today: callLogs.filter(l => l.date === '2026-01-17').length,
    };
  }, [callLogs]);

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Call Logs</h2>
        <p className="page-subtitle">View all call activities and outcomes</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Calls</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Today's Calls</div>
          <div className="stat-value">{stats.today}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Duration</div>
          <div className="stat-value">{stats.avgDuration}</div>
        </div>
      </div>

      <div className="filters">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search by lead or agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Date</label>
            <input
              type="date"
              className="filter-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          {searchTerm || dateFilter ? (
            <button className="btn btn-secondary" onClick={() => { setSearchTerm(''); setDateFilter(''); }}>
              <X size={16} /> Clear
            </button>
          ) : null}
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          {filteredLogs.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Outcome</th>
                  <th>Agent</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td>{log.leadName}</td>
                    <td>{log.date}</td>
                    <td>{log.time}</td>
                    <td>{log.duration}</td>
                    <td>
                      <span className={`outcome-badge outcome-${log.outcome.toLowerCase().replace(/ /g, '-')}`}>
                        {log.outcome}
                      </span>
                    </td>
                    <td>{log.agent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <Phone size={40} />
              </div>
              <div className="empty-title">No call logs found</div>
              <p>Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

// Settings Component
const SettingsModule = memo(({ user }) => {
  const { tenantData } = useAppContext();
  const isAdmin = user.role === 'admin';

  if (!isAdmin) {
    return (
      <>
        <div className="page-header">
          <h2 className="page-title">Settings</h2>
          <p className="page-subtitle">Access Denied</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">
            <Settings size={40} />
          </div>
          <div className="empty-title">Admin Access Required</div>
          <p>Only administrators can access settings</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
        <p className="page-subtitle">Manage your organization settings</p>
      </div>

      <div className="settings-section">
        <h3 className="settings-title">Organization Information</h3>
        <div className="settings-row">
          <div className="settings-info">
            <h4>Organization Name</h4>
            <p>{tenantData.name}</p>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <h4>Tenant ID</h4>
            <p>{user.tenant}</p>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <h4>Total Leads</h4>
            <p>{tenantData.leads.length} active leads</p>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-title">User Profile</h3>
        <div className="settings-row">
          <div className="settings-info">
            <h4>Full Name</h4>
            <p>{user.name}</p>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <h4>Email Address</h4>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <h4>Role</h4>
            <p className={`role-badge role-${user.role}`}>{user.role.toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-title">Permissions</h3>
        <div className="settings-row">
          <div className="settings-info">
            <h4>View Leads</h4>
            <p>Enabled</p>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <h4>Edit Lead Status</h4>
            <p>{isAdmin ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <h4>View Call Logs</h4>
            <p>Enabled</p>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <h4>Access Settings</h4>
            <p>{isAdmin ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
      </div>
    </>
  );
});

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('leads');

  const tenantData = useMemo(() => {
    if (!user) return null;
    return MOCK_DATA[user.tenant];
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveView('leads');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('leads');
  };

  if (!user) {
    return (
      <>
        <style>{styles}</style>
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <AppContext.Provider value={{ tenantData, user }}>
      <style>{styles}</style>
      <div className="app">
        <Header user={user} onLogout={handleLogout} />
        <div className="main">
          <Sidebar activeView={activeView} onViewChange={setActiveView} />
          <main className="content">
            {activeView === 'leads' && <LeadsModule user={user} />}
            {activeView === 'calls' && <CallLogsModule />}
            {activeView === 'settings' && <SettingsModule user={user} />}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;