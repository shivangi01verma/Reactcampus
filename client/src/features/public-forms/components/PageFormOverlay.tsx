import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X } from 'lucide-react';
import { usePageForms, useSubmitForm } from '../hooks/usePublicForm';
import type { FormField, PageAssignment } from '@/types/form';

// ─── Field renderer (shared) ─────────────────────────────────────────────────

function FormField_({ field, register, control, errors, watch }: {
  field: FormField; register: any; control: any; errors: any; watch: any;
}) {
  if (field.conditionalOn?.fieldName) {
    const dep = watch(field.conditionalOn.fieldName);
    if (dep !== field.conditionalOn.value) return null;
  }
  const error = errors[field.name];
  const base = 'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';
  const ec = error ? 'border-red-300' : 'border-gray-300';
  const rules: Record<string, any> = {};
  if (field.validation?.required) rules.required = `${field.label} is required`;
  if (field.validation?.minLength) rules.minLength = { value: field.validation.minLength, message: `Min ${field.validation.minLength} chars` };
  if (field.validation?.maxLength) rules.maxLength = { value: field.validation.maxLength, message: `Max ${field.validation.maxLength} chars` };
  if (field.validation?.pattern) rules.pattern = { value: new RegExp(field.validation.pattern), message: 'Invalid format' };
  if (field.validation?.min) rules.min = { value: field.validation.min, message: `Min ${field.validation.min}` };
  if (field.validation?.max) rules.max = { value: field.validation.max, message: `Max ${field.validation.max}` };

  const renderInput = () => {
    if (['text', 'email', 'phone', 'number', 'date'].includes(field.type)) {
      return <input type={field.type === 'phone' ? 'tel' : field.type} placeholder={field.placeholder} {...register(field.name, rules)} className={`${base} ${ec}`} />;
    }
    if (field.type === 'textarea') {
      return <textarea placeholder={field.placeholder} rows={3} {...register(field.name, rules)} className={`${base} ${ec}`} />;
    }
    if (field.type === 'dropdown') {
      return (
        <select {...register(field.name, rules)} className={`${base} ${ec}`}>
          <option value="">{field.placeholder || 'Select...'}</option>
          {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    }
    if (field.type === 'radio') {
      return (
        <Controller name={field.name} control={control} rules={rules} render={({ field: f }) => (
          <div className="space-y-1">
            {field.options?.map(o => (
              <label key={o.value} className="flex items-center gap-2 text-sm">
                <input type="radio" value={o.value} checked={f.value === o.value} onChange={() => f.onChange(o.value)} />
                {o.label}
              </label>
            ))}
          </div>
        )} />
      );
    }
    if (field.type === 'checkbox') {
      return (
        <Controller name={field.name} control={control} rules={rules} render={({ field: f }) => (
          <div className="space-y-1">
            {field.options?.map(o => (
              <label key={o.value} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={(f.value || []).includes(o.value)}
                  onChange={e => f.onChange(e.target.checked ? [...(f.value || []), o.value] : (f.value || []).filter((v: string) => v !== o.value))} />
                {o.label}
              </label>
            ))}
          </div>
        )} />
      );
    }
    return <input type="text" placeholder={field.placeholder} {...register(field.name, rules)} className={`${base} ${ec}`} />;
  };

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}{field.validation?.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {renderInput()}
      {error && <p className="text-xs text-red-600 mt-0.5">{error.message as string}</p>}
    </div>
  );
}

// ─── Single embedded form ─────────────────────────────────────────────────────

function EmbeddedForm({ form, onClose, pageType, entityId }: {
  form: any; onClose: () => void; pageType: string; entityId?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const submitMutation = useSubmitForm(form.slug);
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = (data: Record<string, any>) => {
    submitMutation.mutate({
      data,
      pageContext: { pageType, entityId: entityId || null, url: window.location.href },
    });
  };

  useEffect(() => {
    if (submitMutation.isSuccess) setSubmitted(true);
  }, [submitMutation.isSuccess]);

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-semibold text-gray-800 mb-1">Thank you!</h3>
        <p className="text-sm text-gray-600">{form.successMessage || 'Your submission was received.'}</p>
        <button onClick={onClose} className="mt-4 text-sm text-brand-600 hover:underline">Close</button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">{form.title}</h3>
        {form.description && <p className="text-sm text-gray-500 mt-0.5">{form.description}</p>}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        {(form.fields || []).map((field: FormField) => (
          <FormField_ key={field.name} field={field} register={register} control={control} errors={errors} watch={watch} />
        ))}
        <button type="submit" disabled={submitMutation.isPending}
          className="w-full mt-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg text-sm disabled:opacity-50 transition-colors">
          {submitMutation.isPending ? 'Submitting...' : 'Submit'}
        </button>
        {submitMutation.isError && <p className="text-xs text-red-600 text-center mt-1">Submission failed. Please try again.</p>}
      </form>
    </>
  );
}

// ─── Trigger + display wrapper for one form ───────────────────────────────────

function SingleFormTrigger({ form, pageType, entityId }: { form: any; pageType: string; entityId?: string }) {
  const [visible, setVisible] = useState(false);
  const config: PageAssignment = form.displayConfig;

  useEffect(() => {
    const storageKey = `form_shown_${form.slug}`;
    if (config.showOnce && localStorage.getItem(storageKey)) return;

    let cleanup: (() => void) | undefined;

    const show = () => setVisible(true);

    if (config.trigger === 'immediate') {
      show();
    } else if (config.trigger === 'delay') {
      const t = setTimeout(show, (config.delaySeconds ?? 5) * 1000);
      cleanup = () => clearTimeout(t);
    } else if (config.trigger === 'scroll') {
      const pct = config.scrollPercent ?? 50;
      const handler = () => {
        const scrolled = document.documentElement.scrollTop / (document.documentElement.scrollHeight - window.innerHeight) * 100;
        if (scrolled >= pct) { show(); window.removeEventListener('scroll', handler); }
      };
      window.addEventListener('scroll', handler, { passive: true });
      cleanup = () => window.removeEventListener('scroll', handler);
    } else if (config.trigger === 'exit_intent') {
      const handler = (e: MouseEvent) => {
        if (e.clientY <= 5) { show(); document.removeEventListener('mouseleave', handler); }
      };
      document.addEventListener('mouseleave', handler);
      cleanup = () => document.removeEventListener('mouseleave', handler);
    }

    return cleanup;
  }, [form.slug, config]);

  const handleClose = () => {
    setVisible(false);
    if (config.showOnce) localStorage.setItem(`form_shown_${form.slug}`, '1');
  };

  if (!visible) return null;

  const displayAs = config.displayAs || 'popup';

  // Popup — centered modal
  if (displayAs === 'popup') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
          <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
          <EmbeddedForm form={form} onClose={handleClose} pageType={pageType} entityId={entityId} />
        </div>
      </div>
    );
  }

  // Slide-in — fixed panel from right
  if (displayAs === 'slide_in') {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 max-h-[85vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
        <EmbeddedForm form={form} onClose={handleClose} pageType={pageType} entityId={entityId} />
      </div>
    );
  }

  // Inline / bottom bar
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4">
      <div className="max-w-2xl mx-auto relative">
        <button onClick={handleClose} className="absolute top-0 right-0 text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
        <EmbeddedForm form={form} onClose={handleClose} pageType={pageType} entityId={entityId} />
      </div>
    </div>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function PageFormOverlay({ pageType, entityId }: { pageType: string; entityId?: string }) {
  const { data: forms } = usePageForms(pageType, entityId);
  if (!forms?.length) return null;
  return (
    <>
      {forms.map((form: any) => (
        <SingleFormTrigger key={form._id} form={form} pageType={pageType} entityId={entityId} />
      ))}
    </>
  );
}
