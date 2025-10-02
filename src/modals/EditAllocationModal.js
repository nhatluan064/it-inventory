// src/modals/EditAllocationModal.js
import React, { useState, useEffect } from "react";
import {
  User,
  Building,
  Badge,
  Briefcase,
  Save,
  X,
  CheckCircle,
} from "lucide-react";

const EditAllocationModal = ({
  show,
  onClose,
  onSubmit,
  item,
  departmentsList,
  positionsList,
  t,
}) => {
  const [formData, setFormData] = useState({
    recipientName: "",
    employeeId: "",
    position: "",
    positionDescription: "",
    department: "",
    giverName: "",
    giverPosition: "",
    giverDepartment: "",
  });

  // Single-step form: populate formData when modal opens
  useEffect(() => {
    if (show && item && item.allocationDetails) {
      const details = item.allocationDetails;
      setFormData({
        recipientName: details.recipientName || "",
        employeeId: details.employeeId || "",
        position: details.position || positionsList[0]?.id || "",
        positionDescription: details.positionDescription || "",
        department: details.department || departmentsList[0]?.id || "",
        giverName: details.giverName || "",
        giverPosition: details.giverPosition || "",
        giverDepartment: details.giverDepartment || departmentsList[0]?.id || "",
      });
    }
  }, [show, item, positionsList, departmentsList]);

  if (!show || !item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(item, formData);
    onClose();
  };

  // Single combined render that includes recipient, employee id, position and department
  const renderCombined = () => (
    <>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-blue-500 w-5 h-5 flex-shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            {t("edit_allocation_details")} <span className="font-medium">{item.name}</span>
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("recipient_name")}
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("employee_id")}
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Badge className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("position")}
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-2.5 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
              required
            >
              {positionsList.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("department")}
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-2.5 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
              required
            >
              {departmentsList.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 mr-3"
        >
          <X className="mr-2 h-4 w-4" />
          {t("cancel")}
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
        >
          <Save className="mr-2 h-4 w-4" />
          {t("save_changes")}
        </button>
      </div>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 backdrop-filter backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        ></div>

        {/* Modal position centering trick */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-blue-600 dark:bg-blue-700 px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <h3
                className="text-lg leading-6 font-medium text-white"
                id="modal-title"
              >
                {t("edit_allocation_details")}
              </h3>
              <div className="ml-3 h-6 flex items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-blue-600 dark:bg-blue-700 rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* removed sub-section titles: recipient_info & position_info */}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {renderCombined()}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAllocationModal;
