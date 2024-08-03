import React, { useState, useEffect } from "react";
import { Modal, Button } from "flowbite-react";
import { connect } from "react-redux";
import { addMember } from "../redux/reducers";
import Swal from "sweetalert2";

function GroupMemberModal({
  isAddMemberOpen,
  setIsAddMemberOpen,
  editMemberModalId,
  onMemberEdit,
  groups,
  addMember,
  selectedGroupIdForMembers,
  setEditMemberModalId,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  useEffect(() => {
    if (editMemberModalId !== null) {
      const foundMember = groups[selectedGroupIdForMembers - 1]?.members.find(
        (member) => member.id === editMemberModalId
      );

      if (foundMember) {
        setFirstName(foundMember.firstName);
        setLastName(foundMember.lastName);
        setEmail(foundMember.email);
        setMobileNumber(foundMember.mobileNumber);
      }
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setMobileNumber("");
    }
  }, [editMemberModalId, groups, selectedGroupIdForMembers - 1]);

  const handleAddMember = async () => {
    if (firstName.trim() === "" || lastName.trim() === "" || email.trim() === "" || mobileNumber.trim() === "") {
      await Swal.fire({
        icon: "warning",
        title: "All fields are required",
        text: "Please fill out all fields before adding.",
        confirmButtonColor: "#50979B",
      });
      return; // Prevent adding with incomplete fields
    }

    const newMember = { firstName, lastName, email, mobileNumber };
    addMember({ groupId: selectedGroupIdForMembers, member: newMember });
    await Swal.fire({
      icon: "success",
      title: "Member Added",
      text: "The member has been added successfully.",
      confirmButtonColor: "#50979B",
    });
    setIsAddMemberOpen(false);
  };

  const handleEditMember = async () => {
    if (firstName.trim() === "" || lastName.trim() === "" || email.trim() === "" || mobileNumber.trim() === "") {
      await Swal.fire({
        icon: "warning",
        title: "All fields are required",
        text: "Please fill out all fields before saving.",
        confirmButtonColor: "#50979B",
      });
      return; // Prevent saving with incomplete fields
    }

    if (editMemberModalId !== null) {
      onMemberEdit(editMemberModalId, { firstName, lastName, email, mobileNumber });
      await Swal.fire({
        icon: "success",
        title: "Member Updated",
        text: "The member has been updated successfully.",
        confirmButtonColor: "#50979B",
      });
      setIsAddMemberOpen(false);
    }
  };

  return (
    <Modal
      show={isAddMemberOpen}
      onClose={() => {
        setIsAddMemberOpen(false);
        setEditMemberModalId(null);
      }}
      className="max-w-full md:max-w-md mx-2 md:mx-auto bg-white/0"
    >
      <Modal.Header className="text-gray-800">
        {editMemberModalId === null ? "Add" : "Edit"} Member
      </Modal.Header>
      <Modal.Body>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={
            editMemberModalId === null ? handleAddMember : handleEditMember
          }
          className="bg-[#50979B] hover:bg-[#508C9B]"
        >
          {editMemberModalId === null ? "Add" : "Save"}
        </Button>
        <Button
          color="gray"
          onClick={() => {
            setIsAddMemberOpen(false);
            setEditMemberModalId(null);
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
  addMember,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupMemberModal);
