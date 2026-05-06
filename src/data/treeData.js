/**
 * Sample hierarchical tree data.
 * Each node has: id, label, optional metadata, and optional children.
 */
const treeData = {
  id: 'root',
  label: 'Root',
  meta: { type: 'Organization', status: 'Active' },
  children: [
    {
      id: 'child-1',
      label: 'Child 1',
      meta: { type: 'Department', status: 'Active' },
      children: [
        {
          id: 'child-1-1',
          label: 'New Node',
          meta: { type: 'Team', status: 'Active' },
          children: [],
        },
        {
          id: 'child-1-2',
          label: 'New Node',
          meta: { type: 'Team', status: 'Active' },
          children: [],
        },
        {
          id: 'child-1-3',
          label: 'New Node',
          meta: { type: 'Team', status: 'Inactive' },
          children: [],
        },
      ],
    },
    {
      id: 'child-2',
      label: 'Child 2',
      meta: { type: 'Department', status: 'Active' },
      children: [
        {
          id: 'child-2-1',
          label: 'New Node',
          meta: { type: 'Team', status: 'Active' },
          children: [],
        },
        {
          id: 'child-2-2',
          label: 'New Node',
          meta: { type: 'Team', status: 'Active' },
          children: [],
        },
        {
          id: 'child-2-3',
          label: 'New Node',
          meta: { type: 'Team', status: 'Active' },
          children: [
            {
              id: 'child-2-3-1',
              label: 'New Node',
              meta: { type: 'Member', status: 'Active' },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 'child-3',
      label: 'New Node',
      meta: { type: 'Department', status: 'Active' },
      children: [],
    },
    {
      id: 'child-4',
      label: 'New Node',
      meta: { type: 'Department', status: 'Pending' },
      children: [
        {
          id: 'child-4-1',
          label: 'New Node',
          meta: { type: 'Team', status: 'Pending' },
          children: [],
        },
      ],
    },
    {
      id: 'child-5',
      label: 'New Node',
      meta: { type: 'Department', status: 'Active' },
      children: [],
    },
    {
      id: 'child-6',
      label: 'New Node',
      meta: { type: 'Department', status: 'Active' },
      children: [],
    },
  ],
};

export default treeData;
