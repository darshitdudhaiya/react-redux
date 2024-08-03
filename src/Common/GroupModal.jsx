import React, { useState, useEffect } from "react";
import { Modal, Button } from "flowbite-react";
import { connect } from "react-redux";
import { addGroup } from "../redux/reducers";
import Swal from "sweetalert2";

function GroupModal({
  groups,
  addGroup,
  isAddGroupOpen,
  setIsAddGroupOpen,
  editGroupModalId,
  onEdit,
  setEditGroupModalId,
}) {
  const [groupName, setGroupName] = useState("");
  const [group, setGroup] = useState(null);

  useEffect(() => {
    if (editGroupModalId !== null) {
      const foundGroup = groups.find((group) => group.id === editGroupModalId);
      setGroup(foundGroup);
      setGroupName(foundGroup ? foundGroup.name : "");
    } else {
      setGroup(null);
      setGroupName("");
    }
  }, [editGroupModalId, groups]);

  const handleAddGroup = async () => {
    if (groupName.trim() === "") {
      await Swal.fire({
        icon: "warning",
        title: "Group name is required",
        text: "Please enter a group name before adding.",
        confirmButtonColor: "#50979B",
      });
      return; // Prevent adding an empty group
    }

    const newGroup = { name: groupName };
    addGroup(newGroup);
    await Swal.fire({
      icon: "success",
      title: "Group Added",
      text: "The group has been added successfully.",
      confirmButtonColor: "#50979B",
    });
    setIsAddGroupOpen(false);
  };

  const editGroup = async () => {
    if (group && groupName.trim() !== "") {
      onEdit(editGroupModalId, { name: groupName, members: group.members });
      await Swal.fire({
        icon: "success",
        title: "Group Updated",
        text: "The group has been updated successfully.",
        confirmButtonColor: "#50979B",
      });
      setIsAddGroupOpen(false);
    } else if (groupName.trim() === "") {
      await Swal.fire({
        icon: "warning",
        title: "Group name is required",
        text: "Please enter a group name before saving.",
        confirmButtonColor: "#50979B",
      });
    }
  };

  return (
    <Modal
      show={isAddGroupOpen}
      onClose={() => {
        setIsAddGroupOpen(false);
        setEditGroupModalId(null);
      }}
      className="max-w-full md:max-w-md mx-2 md:mx-auto bg-white/0"
    >
      <Modal.Header className="text-gray-800">
        {editGroupModalId === null ? "Add" : "Edit"} Group
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={editGroupModalId === null ? handleAddGroup : editGroup}
          className="bg-[#50979B] hover:bg-[#508C9B]"
        >
          {editGroupModalId === null ? "Add" : "Save"}
        </Button>
        <Button
          color="gray"
          onClick={() => {
            setIsAddGroupOpen(false);
            setEditGroupModalId(null);
          }}
          className="bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  groups: state.groups,
});

const mapDispatchToProps = {
  addGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupModal);
