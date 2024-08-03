import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groups: [],
  nextGroupId: 1, // Initialize group ID counter
  nextMemberId: 1, // Initialize member ID counter
};

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    addGroup: (state, action) => {
      const newGroup = {
        ...action.payload,
        id: state.nextGroupId,
        members: [],
      };
      state.groups.push(newGroup);
      state.nextGroupId += 1; // Increment group ID counter
    },
    editGroup: (state, action) => {
      const { groupId, updatedGroup } = action.payload;
      const index = state.groups.findIndex((group) => group.id === groupId);
      if (index !== -1) {
        state.groups[index] = { ...updatedGroup, id: groupId };
      }
    },
    deleteGroup: (state, action) => {
      const groupIdsToDelete = action.payload;
      state.groups = state.groups.filter(
        (group) => !groupIdsToDelete.includes(group.id)
      );
    },
    addMember: (state, action) => {
      const { groupId, member } = action.payload;
      const group = state.groups.find((group) => group.id === groupId);
      if (group) {
        const newMember = { ...member, id: state.nextMemberId };
        group.members.push(newMember);
        state.nextMemberId += 1; // Increment member ID counter
      }
    },
    editMember: (state, action) => {
      const { groupId, memberId, updatedMember } = action.payload;
      const group = state.groups.find((group) => group.id === groupId);
      if (group) {
        const memberIndex = group.members.findIndex(
          (member) => member.id === memberId
        );
        if (memberIndex !== -1) {
          group.members[memberIndex] = { ...updatedMember, id: memberId };
        }
      }
    },
    deleteMember: (state, action) => {
      const { groupId, memberIdsToDelete } = action.payload;
      const group = state.groups.find((group) => group.id === groupId);

      if (group) {
        group.members = group.members.filter(
          (member) => !memberIdsToDelete.includes(member.id)
        );
      }
    },
  },
});

export const {
  addGroup,
  editGroup,
  deleteGroup,
  multipleDeleteGroup,
  addMember,
  editMember,
  deleteMember,
} = groupSlice.actions;
export default groupSlice.reducer;
