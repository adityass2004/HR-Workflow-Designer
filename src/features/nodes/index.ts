import { NodeType } from '@/types';
import StartNode from './StartNode';
import TaskNode from './TaskNode';
import ApprovalNode from './ApprovalNode';
import AutomationNode from './AutomationNode';
import EndNode from './EndNode';
import ProjectNode from './ProjectNode';
import MetricNode from './MetricNode';

export const nodeTypes = {
  [NodeType.Start]: StartNode,
  [NodeType.Task]: TaskNode,
  [NodeType.Approval]: ApprovalNode,
  [NodeType.Automation]: AutomationNode,
  [NodeType.End]: EndNode,
  [NodeType.Project]: ProjectNode,
  [NodeType.MetricInput]: MetricNode,
  [NodeType.NorthStar]: MetricNode,
  [NodeType.KPI]: MetricNode,
};
