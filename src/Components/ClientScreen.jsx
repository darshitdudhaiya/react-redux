import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { useMediaQuery } from "react-responsive";
import { HiMenu, HiX } from "react-icons/hi";
import GroupModal from "../Common/GroupModal";
import MemberModal from "../Common/GroupMemberModal";
import { connect } from "react-redux";
import { useAuth } from "../utils/authUtils";
import { Link, useNavigate } from "react-router-dom";
import {
  addGroup,
  deleteGroup,
  editGroup,
  editMember,
  deleteMember,
} from "../redux/reducers";
import Swal from "sweetalert2";

function ClientScreen({
  groups,
  deleteGroup,
  editGroup,
  editMember,
  deleteMember,
}) {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isAddBtnDisabled, setIsAddBtnDisabled] = useState(false);

  const [editGroupModalId, setEditGroupModalId] = useState(null);
  const [editMemberModalId, setEditMemberModalId] = useState(null);

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroupIdForMembers, setSelectedGroupIdForMembers] =
    useState(null);

  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleDeleteGroup = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#50979B",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      deleteGroup(selectedGroupIds);
      setSelectedGroupIds([]);
      setEditGroupModalId(null);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The group has been deleted.",
        confirmButtonColor: "#50979B",
      });
    }
  };

  const handleEditGroup = (groupId, updatedGroup) => {
    editGroup({ groupId, updatedGroup });
    setSelectedGroupId(null);
    setIsAddBtnDisabled(false);
    setEditGroupModalId(null);
    setSelectedGroupIds([]);
  };

  const handleMemberEdit = (groupId, updatedMember) => {
    if (editMemberModalId !== null) {
      editMember({
        groupId: selectedGroupIdForMembers,
        memberId: editMemberModalId,
        updatedMember: updatedMember,
      });
      setIsAddMemberOpen(false);
      setEditMemberModalId(null);
      setSelectedMemberIds([]);
    }
  };

  const handleMemberDeleted = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#50979B",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      deleteMember({
        groupId: selectedGroupIdForMembers,
        memberIdsToDelete: selectedMemberIds,
      });
      setEditMemberModalId(null);
      setSelectedMemberIds([]);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The Member has been deleted.",
        confirmButtonColor: "#50979B",
      });
    }
  };

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const handleGroupCheckboxChange = (groupId, isChecked) => {
    // Update selectedGroupIds based on the checkbox change
    setSelectedGroupIds((prevIds) => {
      const updatedIds = isChecked
        ? [...prevIds, groupId]
        : prevIds.filter((id) => id !== groupId);

      // Update the editGroupModalId to the first element in the updatedIds list
      setEditGroupModalId(updatedIds.length > 0 ? updatedIds[0] : null);

      // Return the updated selectedGroupIds
      return updatedIds;
    });

    // Update the selectedGroupId state
    setSelectedGroupId(isChecked ? groupId : null);

    // Disable or enable add button based on whether any group is selected
    setIsAddBtnDisabled(selectedGroupIds.length === 0 && !isChecked);
  };

  const handleMemberCheckboxChange = (memberId, isChecked) => {
    // Update selectedMemberIds based on the checkbox change
    setSelectedMemberIds((prevIds) => {
      const updatedIds = isChecked
        ? [...prevIds, memberId]
        : prevIds.filter((id) => id !== memberId);

      // Update the editMemberModalId to the first element in the updatedIds list
      setEditMemberModalId(updatedIds.length > 0 ? updatedIds[0] : null);

      // Return the updated selectedMemberIds
      return updatedIds;
    });
  };

  useEffect(() => {
    const authenticate = async () => {
      const isAuth = await checkAuth();
      setIsAuthenticated(isAuth);
    };

    authenticate();
    document.title = "Dashboard";
  }, [checkAuth]);

  const totalPages = Math.ceil(
    (groups[selectedGroupIdForMembers - 1]?.members?.length || 0) / itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const isGroupListEmpty = groups.length === 0;
  const isMemberSelected = selectedMemberIds.length > 0;
  const isGroupSelectedForMember = selectedGroupIdForMembers !== null;

  if (!isAuthenticated) {
    return (
      <div className="bg-[#134B70] h-screen flex items-center justify-center text-white text-lg">
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"
            ></path>
          </svg>
          <span className="mt-4">Loading...</span>
          <Link to="/">
            <Button className="bg-[#508C9B] hover:bg-[#417482] focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 text-center">
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="h-screen flex flex-col">
      <div className="flex flex-col md:flex-row h-full">
        {/* Sidebar / Group List Section */}
        <div
          className={`fixed inset-0 z-40 transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 bg-[#201E43] p-4 text-white w-64 md:w-1/4 lg:w-1/5`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Group List</h2>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-white"
              >
                <HiX className="w-6 h-6" />
              </button>
            )}
          </div>
          <div className="flex space-x-1.5 justify-around mb-4">
            <Button
              disabled={selectedGroupIds.length !== 0}
              onClick={() => setIsAddGroupOpen(true)}
              className={`text-white ${
                selectedGroupIds.length === 0
                  ? " bg-[#50979B] hover:bg-[#508C9B]"
                  : "bg-[#355d5f] hover:bg-[#355d5f]"
              }  focus:ring-4 font-medium rounded-lg text-sm py-1.5 text-center`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Button>
            <Button
              disabled={selectedGroupIds.length === 0}
              onClick={() => setIsAddGroupOpen(true)}
              className={`text-white ${
                selectedGroupIds.length === 0
                  ? "  bg-[#355d5f] hover:bg-[#355d5f]"
                  : "bg-[#50979B] hover:bg-[#508C9B]"
              }  focus:ring-4 font-medium rounded-lg text-sm py-1.5 text-center`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </Button>
            <Button
              disabled={isGroupListEmpty || selectedGroupIds.length === 0}
              onClick={handleDeleteGroup}
              className={`text-white ${
                isGroupListEmpty || selectedGroupIds.length === 0
                  ? "bg-[#355d5f] hover:bg-[#355d5f]"
                  : "bg-[#50979B] hover:bg-[#508C9B]"
              } focus:ring-4 font-medium rounded-lg text-sm py-1.5 text-center`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          </div>
          <div
            className={`space-y-4 ${
              groups.length === 0
                ? "flex justify-center items-center mt-16"
                : ""
            }`}
          >
            {groups.length > 0
              ? groups.map((group, index) => (
                  <div
                    onClick={() => setSelectedGroupIdForMembers(group.id)}
                    key={index}
                    className={`${
                      selectedGroupIdForMembers === group.id
                        ? "bg-[#31304c]"
                        : "bg-[#282766]"
                    } p-4 py-6 rounded-md shadow-md relative flex items-center`}
                  >
                    <input
                      onChange={(e) =>
                        handleGroupCheckboxChange(group.id, e.target.checked)
                      }
                      type="checkbox"
                      checked={selectedGroupIds.includes(group.id)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <h3 className="text-lg font-semibold ml-4">{group.name}</h3>
                  </div>
                ))
              : "No Groups Found"}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#134B70] p-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Group Members</h2>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-white"
              >
                <HiMenu className="w-6 h-6" />
              </button>
            )}
            {!isMobile && (
              <div className="relative flex space-x-2">
                <Button
                  disabled={
                    isGroupListEmpty ||
                    !isGroupSelectedForMember ||
                    isMemberSelected
                  }
                  onClick={() => setIsAddMemberOpen(true)}
                  className={`text-white ${
                    isGroupListEmpty ||
                    !isGroupSelectedForMember ||
                    isMemberSelected
                      ? "bg-[#355d5f] hover:bg-[#355d5f]"
                      : "bg-[#50979B] hover:bg-[#508C9B]"
                  } focus:ring-4 font-medium rounded-lg text-sm py-1.5 text-center`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </Button>

                <Button
                  disabled={selectedMemberIds.length === 0}
                  onClick={() => setIsAddMemberOpen(true)}
                  className={`text-white ${
                    selectedMemberIds.length === 0
                      ? "  bg-[#355d5f] hover:bg-[#355d5f]"
                      : "bg-[#50979B] hover:bg-[#508C9B]"
                  }  focus:ring-4 font-medium rounded-lg text-sm py-1.5 text-center`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </Button>
                <Button
                  disabled={
                    !isGroupSelectedForMember ||
                    !isMemberSelected ||
                    selectedMemberIds.length === 0
                  }
                  onClick={handleMemberDeleted}
                  className={`text-white ${
                    !isGroupSelectedForMember || selectedMemberIds.length === 0
                      ? "  bg-[#355d5f] hover:bg-[#355d5f]"
                      : "bg-[#50979B] hover:bg-[#508C9B]"
                  } focus:ring-4 font-medium rounded-lg text-sm py-1.5 text-center`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </div>
            )}
          </div>
          {isMobile && (
            <div className="relative flex justify-around space-x-2 mb-5">
              <Button
                disabled={
                  isGroupListEmpty ||
                  !isGroupSelectedForMember ||
                  isMemberSelected
                }
                onClick={() => setIsAddMemberOpen(true)}
                className={`text-white ${
                  isGroupListEmpty ||
                  !isGroupSelectedForMember ||
                  isMemberSelected
                    ? "bg-[#355d5f] hover:bg-[#355d5f]"
                    : "bg-[#50979B] hover:bg-[#508C9B]"
                } focus:ring-4 font-medium rounded-lg text-sm py-1.5 text-center`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </Button>

              <Button
                disabled={selectedMemberIds.length === 0}
                onClick={() => setIsAddMemberOpen(true)}
                className={`text-white ${
                  selectedMemberIds.length === 0
                    ? "  bg-[#355d5f] hover:bg-[#355d5f]"
                    : "bg-[#50979B] hover:bg-[#508C9B]"
                }  focus:ring-4 font-medium rounded-lg text-sm py-1.5 text-center`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </Button>
              <Button
                disabled={
                  !isGroupSelectedForMember ||
                  !isMemberSelected ||
                  selectedMemberIds.length === 0
                }
                onClick={handleMemberDeleted}
                className={`text-white ${
                  !isGroupSelectedForMember || selectedMemberIds.length === 0
                    ? "  bg-[#355d5f] hover:bg-[#355d5f]"
                    : "bg-[#50979B] hover:bg-[#508C9B]"
                } focus:ring-4 font-medium rounded-lg text-sm py-1.5 text-center`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
              <thead>
                <tr className="bg-[#1D5A82] text-white">
                  <th className="border px-2 py-1 text-sm md:px-4 md:py-2 text-center">
                    Select
                  </th>
                  <th className="border px-2 py-1 text-sm md:px-4 md:py-2">
                    First Name
                  </th>
                  <th className="border px-2 py-1 text-sm md:px-4 md:py-2">
                    Last Name
                  </th>
                  <th className="border px-2 py-1 text-sm md:px-4 md:py-2">
                    Email
                  </th>
                  <th className="border px-2 py-1 text-sm md:px-4 md:py-2">
                    Mobile Number
                  </th>
                </tr>
              </thead>
              <tbody>
                {groups.length > 0 && selectedGroupIdForMembers !== null ? (
                  // Slice members array based on current page
                  groups[selectedGroupIdForMembers - 1]?.members?.slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  ).length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="border px-2 py-1 text-sm md:px-4 md:py-2 text-center bg-[#194d70] text-white"
                      >
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    groups[selectedGroupIdForMembers - 1]?.members
                      ?.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((member, index) => (
                        <tr key={index} className="bg-[#194d70] text-white">
                          <td className="border px-2 py-1 text-sm md:px-4 md:py-2 text-center">
                            <input
                              onChange={(e) =>
                                handleMemberCheckboxChange(
                                  member.id,
                                  e.target.checked
                                )
                              }
                              type="checkbox"
                              checked={selectedMemberIds.includes(member.id)}
                              className="form-checkbox h-5 w-5 text-blue-600"
                              aria-label={`Select ${member.firstName} ${member.lastName}`}
                            />
                          </td>
                          <td className="border px-2 py-1 text-sm md:px-4 md:py-2">
                            {member.firstName}
                          </td>
                          <td className="border px-2 py-1 text-sm md:px-4 md:py-2">
                            {member.lastName}
                          </td>
                          <td className="border px-2 py-1 text-sm md:px-4 md:py-2">
                            {member.email}
                          </td>
                          <td className="border px-2 py-1 text-sm md:px-4 md:py-2">
                            {member.mobileNumber}
                          </td>
                        </tr>
                      ))
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="border px-2 py-1 text-sm md:px-4 md:py-2 text-center bg-[#194d70] text-white"
                    >
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-row md:flex-row items-center justify-center mt-4 space-y-2 md:space-y-0 md:space-x-2 space-x-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#50979B] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="First Page"
            >
              1
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#50979B] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              ←
            </button>
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#50979B] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              →
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#50979B] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Last Page"
            >
              {totalPages}
            </button>
          </div>
        </div>
      </div>
      {/*  Group Modal */}
      <GroupModal
        isAddGroupOpen={isAddGroupOpen}
        setIsAddGroupOpen={setIsAddGroupOpen}
        editGroupModalId={editGroupModalId}
        setEditGroupModalId={setEditGroupModalId}
        onEdit={handleEditGroup}
      />

      {/* Add Member Modal */}
      <MemberModal
        isAddMemberOpen={isAddMemberOpen}
        setIsAddMemberOpen={setIsAddMemberOpen}
        selectedGroupIdForMembers={selectedGroupIdForMembers}
        editMemberModalId={editMemberModalId}
        setEditMemberModalId={setEditMemberModalId}
        onMemberEdit={handleMemberEdit}
      />
    </section>
  );
}

const mapStateToProps = (state) => ({
  groups: state.groups,
});

const mapDispatchToProps = {
  addGroup,
  deleteGroup,
  editGroup,
  editMember,
  deleteMember,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientScreen);
