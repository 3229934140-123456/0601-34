import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TestCaseLibrary from './pages/TestCaseLibrary';
import TestPlan from './pages/TestPlan';
import TestExecution from './pages/TestExecution';
import DefectManagement from './pages/DefectManagement';
import TestData from './pages/TestData';
import TestReport from './pages/TestReport';
import PermissionManagement from './pages/PermissionManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/test-cases" replace />} />
          <Route path="test-cases" element={<TestCaseLibrary />} />
          <Route path="test-plans" element={<TestPlan />} />
          <Route path="test-execution" element={<TestExecution />} />
          <Route path="defects" element={<DefectManagement />} />
          <Route path="test-data" element={<TestData />} />
          <Route path="reports" element={<TestReport />} />
          <Route path="permissions" element={<PermissionManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
