import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { usePublicForm, useSubmitForm } from '../hooks/usePublicForm';
import { Spinner } from '@/components/ui/Spinner';
import type { FormField } from '@/types/form';

function DynamicField({ field, register, control, errors, watch }: {
  field: FormField;
  register: any;
  control: any;
  errors: any;
  watch: any;
}) {
  if (field.conditionalOn?.fieldName) {
    const depValue = watch(field.conditionalOn.fieldName);
    if (depValue !== field.conditionalOn.value) return null;
  }

  const error = errors[field.name];
  const baseClass = 'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const errorClass = error ? 'border-red-300' : 'border-gray-300';

  const rules: Record<string, any> = {};
  if (field.validation?.required) rules.required = `${field.label} is required`;
  if (field.validation?.minLength) rules.minLength = { value: field.validation.minLength, message: `Minimum ${field.validation.minLength} characters` };
  if (field.validation?.maxLength) rules.maxLength = { value: field.validation.maxLength, message: `Maximum ${field.validation.maxLength} characters` };
  if (field.validation?.pattern) rules.pattern = { value: new RegExp(field.validation.pattern), message: 'Invalid format' };
  if (field.validation?.min) rules.min = { value: field.validation.min, message: `Minimum value is ${field.validation.min}` };
  if (field.validation?.max) rules.max = { value: field.validation.max, message: `Maximum value is ${field.validation.max}` };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
      case 'date':
        return (
          <input
            type={field.type === 'phone' ? 'tel' : field.type}
            placeholder={field.placeholder}
            {...register(field.name, rules)}
            className={`${baseClass} ${errorClass}`}
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            rows={4}
            {...register(field.name, rules)}
            className={`${baseClass} ${errorClass}`}
          />
        );

      case 'dropdown':
        return (
          <select {...register(field.name, rules)} className={`${baseClass} ${errorClass}`}>
            <option value="">{field.placeholder || 'Select...'}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={rules}
            render={({ field: f }) => (
              <div className="space-y-2">
                {field.options?.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      value={opt.value}
                      checked={f.value === opt.value}
                      onChange={(e) => f.onChange(e.target.value)}
                      className="text-blue-600"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={rules}
            render={({ field: f }) => (
              <div className="space-y-2">
                {field.options?.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={(f.value || []).includes(opt.value)}
                      onChange={(e) => {
                        const current = f.value || [];
                        f.onChange(
                          e.target.checked
                            ? [...current, opt.value]
                            : current.filter((v: string) => v !== opt.value)
                        );
                      }}
                      className="text-blue-600"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            )}
          />
        );

      case 'file':
        return (
          <input
            type="file"
            {...register(field.name, rules)}
            className="text-sm text-gray-600"
          />
        );

      default:
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            {...register(field.name, rules)}
            className={`${baseClass} ${errorClass}`}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.validation?.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {renderField()}
      {error && <p className="text-xs text-red-600 mt-1">{error.message as string}</p>}
    </div>
  );
}

export default function DynamicFormRenderer() {
  const { slug } = useParams<{ slug: string }>();
  const { data: form, isLoading } = usePublicForm(slug!);
  const submitMutation = useSubmitForm(slug!);
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm();

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!form) return <div className="text-center py-16 text-gray-500">Form not found.</div>;

  const onSubmit = (data: Record<string, any>) => {
    submitMutation.mutate({ data, pageContext: { pageType: 'page', url: window.location.href } });
  };

  if (submitMutation.isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h2>
          <p className="text-green-700">{form.successMessage || 'Your form has been submitted successfully.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{form.title}</h1>
        {form.description && <p className="text-gray-600 mb-6">{form.description}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          {form.fields?.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              register={register}
              control={control}
              errors={errors}
              watch={watch}
            />
          ))}

          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitMutation.isPending ? 'Submitting...' : 'Submit'}
          </button>

          {submitMutation.isError && (
            <p className="text-sm text-red-600 text-center">Failed to submit the form. Please try again.</p>
          )}
        </form>
      </div>
    </div>
  );
}
