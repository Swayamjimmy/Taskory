import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Pagination } from '../components/Pagination';

export function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Re-fetch tasks whenever a filter, search, or page changes
  useEffect(() => {
    const params = { page, limit: 10 };
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (search) params.search = search;
    api.getTasks(params).then(data => { setTasks(data.items); setTotal(data.total); setPages(data.pages); });
  }, [page, status, priority, search]);