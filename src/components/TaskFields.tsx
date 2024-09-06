import React, { useCallback } from 'react';
import { useFieldArray, useFormContext, useFormState } from 'react-hook-form';
import { FormInput } from './Input';
import { MaterialFields } from './MaterialFields';
import { AiFillPlusCircle, AiFillCloseCircle } from 'react-icons/ai';
import { ErrorMessage } from '@hookform/error-message';
import { DEFAULT_TASK_VALUE } from '../constants';

interface Props {
  groupIndex: number;
}

export const TaskFields: React.FC<Props> = ({ groupIndex }) => {
  const { control, watch, setValue } = useFormContext();
  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({
    control,
    name: `groups.${groupIndex}.tasks`,
  });
  const { errors } = useFormState({ control });

  const calculateTotal = useCallback((quantity: number, rate: number, taskIndex: number): number => {
    setValue(`groups.${groupIndex}.tasks.${taskIndex}.total`, quantity * rate);
    return quantity * rate;
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold">Tasks</h4>
        <button type="button" aria-label="Add Task" onClick={() => appendTask(DEFAULT_TASK_VALUE)}>
          <AiFillPlusCircle className="text-green-700 w-6 h-6" />
        </button>
      </div>
      {taskFields.map((task, taskIndex) => (
        <div key={task.id} className="flex flex-col gap-5 p-5 rounded-xl border border-gray-300">
          <div className="flex items-center gap-2">
            <h5 className="font-semibold">Task {taskIndex + 1}</h5>
            <button type="button" onClick={() => removeTask(taskIndex)}>
              <AiFillCloseCircle className="text-red-600 w-6 h-6" />
            </button>
          </div>
          <FormInput label="Task Name" name={`groups.${groupIndex}.tasks.${taskIndex}.name`} />
          <FormInput label="Description" name={`groups.${groupIndex}.tasks.${taskIndex}.description`} />
          <FormInput label="Quantity" name={`groups.${groupIndex}.tasks.${taskIndex}.quantity`} type="number" />
          <FormInput label="Rate" name={`groups.${groupIndex}.tasks.${taskIndex}.rate`} type="number" />
          <FormInput
            label="Total"
            name={`groups.${groupIndex}.tasks.${taskIndex}.total`}
            type="number"
            value={calculateTotal(
              watch(`groups.${groupIndex}.tasks.${taskIndex}.quantity`),
              watch(`groups.${groupIndex}.tasks.${taskIndex}.rate`),
              taskIndex
            )}
            readOnly
            disabled
          />
          <MaterialFields groupIndex={groupIndex} taskIndex={taskIndex} />
        </div>
      ))}
      <ErrorMessage
        errors={errors}
        name={`groups.${groupIndex}.tasks`}
        render={({ message }) => <p className="text-red-600">{message}</p>}
      />
    </div>
  );
};
