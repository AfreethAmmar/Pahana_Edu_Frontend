import React from 'react';
import { useForm } from 'react-hook-form';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const FormModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  loading = false,
  fields = [],
  initialData = {},
  submitText = 'Save',
  cancelText = 'Cancel'
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: initialData
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      label: field.label,
      required: field.required,
      error: errors[field.name]?.message,
      ...register(field.name, field.validation || {})
    };

    switch (field.type) {
      case 'select':
        return (
          <Select
            key={field.name}
            {...commonProps}
            options={field.options || []}
            placeholder={field.placeholder}
          />
        );
      case 'textarea':
        return (
          <div key={field.name}>
            {field.label && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <textarea
              {...commonProps}
              rows={field.rows || 3}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-none"
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );
      case 'number':
        return (
          <Input
            key={field.name}
            {...commonProps}
            type="number"
            placeholder={field.placeholder}
            step={field.step}
            min={field.min}
            max={field.max}
          />
        );
      case 'email':
        return (
          <Input
            key={field.name}
            {...commonProps}
            type="email"
            placeholder={field.placeholder}
          />
        );
      case 'password':
        return (
          <Input
            key={field.name}
            {...commonProps}
            type="password"
            placeholder={field.placeholder}
          />
        );
      default:
        return (
          <Input
            key={field.name}
            {...commonProps}
            type="text"
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {fields.map(renderField)}
        </div>

        <div className="flex justify-end space-x-3 pt-6 mt-8 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Saving...' : submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;