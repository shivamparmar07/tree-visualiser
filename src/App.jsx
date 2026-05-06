import { ReactFlowProvider } from '@xyflow/react';
import TreeVisualizer from './components/TreeVisualizer';

function App() {
  return (
    <ReactFlowProvider>
      <TreeVisualizer />
    </ReactFlowProvider>
  );
}

export default App;
