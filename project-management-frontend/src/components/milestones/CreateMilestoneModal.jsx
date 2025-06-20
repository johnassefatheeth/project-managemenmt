// src/components/milestones/CreateMilestoneModal.jsx

import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { createMilestone } from "../../store/slices/milestoneSlice";
import LoadingSpinner from "../common/LoadingSpinner";

const CreateMilestoneModal = ({ isOpen, onClose, projectId }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.milestones);

  // Component-level state for the form inputs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState(null);

  const handleClose = () => {
    // Reset form state when closing
    setName("");
    setDescription("");
    setDueDate("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !dueDate) {
      setError("Milestone name and due date are required.");
      return;
    }

    const milestoneData = { name, description, dueDate };

    try {
      // Dispatch the thunk and unwrap the result to handle success/failure
      await dispatch(
        createMilestone({ projectId, milestoneData })
      ).unwrap();
      handleClose(); // Close modal on success
    } catch (rejectedValue) {
      // The `rejectedValue` is the value from `rejectWithValue` in your thunk
      setError(rejectedValue || "Failed to create milestone.");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Create New Milestone
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="milestone-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Milestone Name
                    </label>
                    <input
                      type="text"
                      id="milestone-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="milestone-description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      id="milestone-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="milestone-dueDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="milestone-dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isLoading}
                      className="inline-flex justify-center items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-black hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:bg-primary-300 disabled:cursor-not-allowed"
                    >
                      {!isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        "Create Milestone"
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateMilestoneModal;