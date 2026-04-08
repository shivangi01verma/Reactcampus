import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContentSections, useExamContentSections, useCourseContentSections, useCreateContentSection, useUpdateContentSection, useDeleteContentSection } from '../hooks/useContentSections';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { CONTENT_TYPES } from '@/config/constants';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import {
  Plus, Edit, Trash2, Eye, EyeOff, ChevronDown, ChevronRight,
  GripVertical, ArrowLeft, Table, FileText, List, HelpCircle, Image,
} from 'lucide-react';
import type { ContentSection } from '@/types/contentSection';

// ─── Constants ───────────────────────────────────────────────────────────────

const COLLEGE_TAB_OPTIONS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Courses & Fees', value: 'courses-fee' },
  { label: 'Placements', value: 'placements' },
  { label: 'Admission', value: 'admission' },
  { label: 'Cutoff', value: 'cutoff' },
  { label: 'Scholarship', value: 'scholarship' },
  { label: 'Faculty', value: 'faculty' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Custom...', value: '__custom__' },
];

const EXAM_TAB_OPTIONS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Syllabus', value: 'syllabus' },
  { label: 'Exam Pattern', value: 'exam-pattern' },
  { label: 'Application Process', value: 'application-process' },
  { label: 'Preparation Tips', value: 'preparation-tips' },
  { label: 'Result', value: 'result' },
  { label: 'Answer Key', value: 'answer-key' },
  { label: 'Cutoff', value: 'cutoff' },
  { label: 'Custom...', value: '__custom__' },
];

const COURSE_TAB_OPTIONS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Syllabus', value: 'syllabus' },
  { label: 'Eligibility', value: 'eligibility' },
  { label: 'Career Prospects', value: 'career-prospects' },
  { label: 'Admission Process', value: 'admission-process' },
  { label: 'Custom...', value: '__custom__' },
];

const COLLEGE_TAB_ORDER = ['overview', 'courses-fee', 'placements', 'admission', 'cutoff', 'scholarship', 'faculty', 'infrastructure'];
const EXAM_TAB_ORDER = ['overview', 'syllabus', 'exam-pattern', 'application-process', 'preparation-tips', 'result', 'answer-key', 'cutoff'];
const COURSE_TAB_ORDER = ['overview', 'syllabus', 'eligibility', 'career-prospects', 'admission-process'];

// Keep TAB_OPTIONS/TAB_ORDER as aliases for backwards compatibility in tabLabel
const TAB_OPTIONS = [...COLLEGE_TAB_OPTIONS, ...EXAM_TAB_OPTIONS.filter(t => !COLLEGE_TAB_OPTIONS.find(c => c.value === t.value))];
const TAB_ORDER = COLLEGE_TAB_ORDER;

const CONTENT_TYPE_ICONS: Record<string, typeof Table> = {
  richtext: FileText,
  table: Table,
  faq: HelpCircle,
  list: List,
  gallery: Image,
};

// ─── Rich Text Editor ────────────────────────────────────────────────────────

function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const execCommand = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    const editor = document.getElementById('richtext-editor');
    if (editor) onChange(editor.innerHTML);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        <button type="button" onClick={() => execCommand('bold')} className="p-1.5 rounded hover:bg-gray-200 text-sm font-bold" title="Bold">B</button>
        <button type="button" onClick={() => execCommand('italic')} className="p-1.5 rounded hover:bg-gray-200 text-sm italic" title="Italic">I</button>
        <button type="button" onClick={() => execCommand('underline')} className="p-1.5 rounded hover:bg-gray-200 text-sm underline" title="Underline">U</button>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" onClick={() => execCommand('formatBlock', 'h2')} className="p-1.5 rounded hover:bg-gray-200 text-xs font-bold" title="Heading 2">H2</button>
        <button type="button" onClick={() => execCommand('formatBlock', 'h3')} className="p-1.5 rounded hover:bg-gray-200 text-xs font-bold" title="Heading 3">H3</button>
        <button type="button" onClick={() => execCommand('formatBlock', 'p')} className="p-1.5 rounded hover:bg-gray-200 text-xs" title="Paragraph">P</button>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 rounded hover:bg-gray-200 text-xs" title="Bullet List">&#8226; List</button>
        <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1.5 rounded hover:bg-gray-200 text-xs" title="Numbered List">1. List</button>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter link URL:');
            if (url) execCommand('createLink', url);
          }}
          className="p-1.5 rounded hover:bg-gray-200 text-xs"
          title="Insert Link"
        >
          Link
        </button>
      </div>
      <div
        id="richtext-editor"
        contentEditable
        className="min-h-[200px] p-3 text-sm prose prose-sm max-w-none focus:outline-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
      />
    </div>
  );
}

// ─── Table Editor ────────────────────────────────────────────────────────────

function TableEditor({
  value,
  onChange,
}: {
  value: { headers: string[]; rows: string[][] };
  onChange: (v: { headers: string[]; rows: string[][] }) => void;
}) {
  const addColumn = () => {
    onChange({
      headers: [...value.headers, ''],
      rows: value.rows.map(r => [...r, '']),
    });
  };

  const removeColumn = (colIdx: number) => {
    if (value.headers.length <= 1) return;
    onChange({
      headers: value.headers.filter((_, i) => i !== colIdx),
      rows: value.rows.map(r => r.filter((_, i) => i !== colIdx)),
    });
  };

  const addRow = () => {
    onChange({ ...value, rows: [...value.rows, new Array(value.headers.length).fill('')] });
  };

  const removeRow = (rowIdx: number) => {
    onChange({ ...value, rows: value.rows.filter((_, i) => i !== rowIdx) });
  };

  const updateHeader = (colIdx: number, text: string) => {
    const headers = [...value.headers];
    headers[colIdx] = text;
    onChange({ ...value, headers });
  };

  const updateCell = (rowIdx: number, colIdx: number, text: string) => {
    const rows = value.rows.map(r => [...r]);
    rows[rowIdx][colIdx] = text;
    onChange({ ...value, rows });
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="bg-brand-50">
              {value.headers.map((h, ci) => (
                <th key={ci} className="px-1 py-1 border-b border-r border-gray-200 last:border-r-0">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => updateHeader(ci, e.target.value)}
                      placeholder={`Header ${ci + 1}`}
                      className="w-full px-2 py-1.5 text-sm font-semibold bg-transparent focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-400 rounded"
                    />
                    {value.headers.length > 1 && (
                      <button type="button" onClick={() => removeColumn(ci)} className="text-red-400 hover:text-red-600 p-0.5 flex-shrink-0" title="Remove column">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-10 border-b border-gray-200" />
            </tr>
          </thead>
          <tbody>
            {value.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-1 py-1 border-r border-gray-200 last:border-r-0">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      placeholder="..."
                      className="w-full px-2 py-1.5 text-sm bg-transparent focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-400 rounded"
                    />
                  </td>
                ))}
                <td className="w-10 text-center">
                  <button type="button" onClick={() => removeRow(ri)} className="text-red-400 hover:text-red-600 p-1" title="Remove row">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Row
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={addColumn}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Column
        </Button>
      </div>
    </div>
  );
}

// ─── FAQ Editor ──────────────────────────────────────────────────────────────

function FaqEditor({
  value,
  onChange,
}: {
  value: { items: { question: string; answer: string }[] };
  onChange: (v: { items: { question: string; answer: string }[] }) => void;
}) {
  const addItem = () => {
    onChange({ items: [...value.items, { question: '', answer: '' }] });
  };

  const removeItem = (idx: number) => {
    onChange({ items: value.items.filter((_, i) => i !== idx) });
  };

  const updateItem = (idx: number, field: 'question' | 'answer', text: string) => {
    const items = value.items.map((item, i) =>
      i === idx ? { ...item, [field]: text } : item
    );
    onChange({ items });
  };

  return (
    <div className="space-y-3">
      {value.items.map((item, idx) => (
        <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full mt-1">Q{idx + 1}</span>
            <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1" title="Remove FAQ">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <input
            type="text"
            value={item.question}
            onChange={(e) => updateItem(idx, 'question', e.target.value)}
            placeholder="Enter question..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400 font-medium"
          />
          <textarea
            value={item.answer}
            onChange={(e) => updateItem(idx, 'answer', e.target.value)}
            placeholder="Enter answer..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="h-3.5 w-3.5 mr-1" /> Add FAQ Item
      </Button>
    </div>
  );
}

// ─── List Editor ─────────────────────────────────────────────────────────────

function ListEditor({
  value,
  onChange,
}: {
  value: { items: string[] };
  onChange: (v: { items: string[] }) => void;
}) {
  const addItem = () => {
    onChange({ items: [...value.items, ''] });
  };

  const removeItem = (idx: number) => {
    onChange({ items: value.items.filter((_, i) => i !== idx) });
  };

  const updateItem = (idx: number, text: string) => {
    const items = [...value.items];
    items[idx] = text;
    onChange({ items });
  };

  return (
    <div className="space-y-2">
      {value.items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="text-brand-500 text-sm flex-shrink-0">&#9679;</span>
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(idx, e.target.value)}
            placeholder={`Item ${idx + 1}...`}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1" title="Remove item">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
      </Button>
    </div>
  );
}

// ─── Gallery Editor ──────────────────────────────────────────────────────────

function GalleryEditor({
  value,
  onChange,
}: {
  value: { images: { url: string; caption: string }[] };
  onChange: (v: { images: { url: string; caption: string }[] }) => void;
}) {
  const addImage = () => {
    onChange({ images: [...value.images, { url: '', caption: '' }] });
  };

  const removeImage = (idx: number) => {
    onChange({ images: value.images.filter((_, i) => i !== idx) });
  };

  const updateImage = (idx: number, field: 'url' | 'caption', text: string) => {
    const images = value.images.map((img, i) =>
      i === idx ? { ...img, [field]: text } : img
    );
    onChange({ images });
  };

  return (
    <div className="space-y-3">
      {value.images.map((img, idx) => (
        <div key={idx} className="flex items-start gap-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
            {img.url ? (
              <img src={img.url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <Image className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={img.url}
              onChange={(e) => updateImage(idx, 'url', e.target.value)}
              placeholder="Image URL..."
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <input
              type="text"
              value={img.caption}
              onChange={(e) => updateImage(idx, 'caption', e.target.value)}
              placeholder="Caption (optional)..."
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <button type="button" onClick={() => removeImage(idx)} className="text-red-400 hover:text-red-600 p-1" title="Remove image">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addImage}>
        <Plus className="h-3.5 w-3.5 mr-1" /> Add Image
      </Button>
    </div>
  );
}

// ─── Content Editor Dispatcher ───────────────────────────────────────────────

function ContentEditor({
  contentType,
  value,
  onChange,
}: {
  contentType: string;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (contentType) {
    case 'richtext':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <RichTextEditor
            value={typeof value === 'string' ? value : (value as any)?.body || ''}
            onChange={(html) => onChange({ body: html })}
          />
        </div>
      );

    case 'table':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Table Data</label>
          <TableEditor
            value={{ headers: ['Column 1'], rows: [['']],  ...(value as any) }}
            onChange={onChange}
          />
        </div>
      );

    case 'faq':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">FAQ Items</label>
          <FaqEditor
            value={{ items: [], ...(value as any) }}
            onChange={onChange}
          />
        </div>
      );

    case 'list':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">List Items</label>
          <ListEditor
            value={{ items: [], ...(value as any) }}
            onChange={onChange}
          />
        </div>
      );

    case 'gallery':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
          <GalleryEditor
            value={{ images: [], ...(value as any) }}
            onChange={onChange}
          />
        </div>
      );

    default:
      return (
        <Textarea
          label="Content (Raw)"
          value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
        />
      );
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseContentForEditor(section: ContentSection): unknown {
  const raw = section.content;
  if (section.contentType === 'richtext') {
    if (typeof raw === 'string') return { body: raw };
    if (raw && typeof raw === 'object' && 'body' in (raw as any)) return raw;
    return { body: '' };
  }
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return raw; }
  }
  return raw || getDefaultContent(section.contentType);
}

function getDefaultContent(contentType: string): unknown {
  switch (contentType) {
    case 'richtext': return { body: '' };
    case 'table': return { headers: ['Column 1', 'Column 2'], rows: [['', '']] };
    case 'faq': return { items: [{ question: '', answer: '' }] };
    case 'list': return { items: [''] };
    case 'gallery': return { images: [{ url: '', caption: '' }] };
    default: return '';
  }
}

function serializeContent(contentType: string, value: unknown): unknown {
  if (contentType === 'richtext') {
    return (value as any)?.body || '';
  }
  return value;
}

function getContentPreview(section: ContentSection): string {
  const raw = section.content;
  switch (section.contentType) {
    case 'richtext': {
      const html = typeof raw === 'string' ? raw : (raw as any)?.body || '';
      const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      return text.length > 150 ? text.slice(0, 150) + '...' : text || '(empty)';
    }
    case 'table': {
      const t = raw as any;
      const cols = t?.headers?.length ?? 0;
      const rows = t?.rows?.length ?? 0;
      return cols || rows ? `${cols} column${cols !== 1 ? 's' : ''}, ${rows} row${rows !== 1 ? 's' : ''}` : '(empty table)';
    }
    case 'faq': {
      const f = raw as any;
      const count = f?.items?.length ?? 0;
      return count ? `${count} FAQ item${count !== 1 ? 's' : ''}` : '(no FAQ items)';
    }
    case 'list': {
      const l = raw as any;
      const count = l?.items?.length ?? 0;
      return count ? `${count} list item${count !== 1 ? 's' : ''}` : '(no list items)';
    }
    case 'gallery': {
      const g = raw as any;
      const count = g?.images?.length ?? 0;
      return count ? `${count} image${count !== 1 ? 's' : ''}` : '(no images)';
    }
    default:
      return typeof raw === 'string' ? (raw.slice(0, 150) || '(empty)') : '(empty)';
  }
}

// ─── View Content Renderer ──────────────────────────────────────────────────

function ViewContentRenderer({ section }: { section: ContentSection }) {
  const content = section.content as any;

  switch (section.contentType) {
    case 'richtext': {
      const html = typeof content === 'string' ? content : (content?.body || '');
      return html ? (
        <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="text-gray-400 text-sm italic">No content</p>
      );
    }
    case 'table': {
      const headers = content?.headers || [];
      const rows = content?.rows || [];
      if (!headers.length) return <p className="text-gray-400 text-sm italic">Empty table</p>;
      return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                {headers.map((h: string, i: number) => (
                  <th key={i} className="px-4 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row: string[], ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell: string, ci: number) => (
                    <td key={ci} className="px-4 py-2 text-sm text-gray-700">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'faq': {
      const items = content?.items || [];
      if (!items.length) return <p className="text-gray-400 text-sm italic">No FAQ items</p>;
      return (
        <div className="space-y-3">
          {items.map((item: { question: string; answer: string }, i: number) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <p className="font-medium text-sm text-gray-800">Q{i + 1}: {item.question}</p>
              <p className="text-sm text-gray-600 mt-1">{item.answer}</p>
            </div>
          ))}
        </div>
      );
    }
    case 'list': {
      const items = content?.items || [];
      if (!items.length) return <p className="text-gray-400 text-sm italic">No list items</p>;
      return (
        <ul className="space-y-1.5">
          {items.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-brand-500 mt-0.5">&#9679;</span>
              {item}
            </li>
          ))}
        </ul>
      );
    }
    case 'gallery': {
      const images = content?.images || [];
      if (!images.length) return <p className="text-gray-400 text-sm italic">No images</p>;
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img: { url: string; caption: string }, i: number) => (
            <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
              <img src={img.url} alt={img.caption || ''} className="w-full h-32 object-cover" />
              {img.caption && <p className="text-xs text-gray-500 p-2">{img.caption}</p>}
            </div>
          ))}
        </div>
      );
    }
    default:
      return <p className="text-sm text-gray-500 whitespace-pre-wrap">{typeof content === 'string' ? content : JSON.stringify(content, null, 2)}</p>;
  }
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ContentSectionListPage() {
  const { collegeId, examId, courseId } = useParams();
  const isCourse = !!courseId;
  const isExam = !!examId;
  const resourceId = courseId || examId || collegeId || '';
  const collegeResult = useContentSections(!isExam && !isCourse ? resourceId : '');
  const examResult = useExamContentSections(isExam ? resourceId : '');
  const courseResult = useCourseContentSections(isCourse ? resourceId : '');
  const { data: sections, isLoading } = isCourse ? courseResult : isExam ? examResult : collegeResult;
  const tabOptions = isCourse ? COURSE_TAB_OPTIONS : isExam ? EXAM_TAB_OPTIONS : COLLEGE_TAB_OPTIONS;
  const tabOrder = isCourse ? COURSE_TAB_ORDER : isExam ? EXAM_TAB_ORDER : COLLEGE_TAB_ORDER;
  const backLink = isCourse ? '/admin/courses' : isExam ? '/admin/exams' : '/admin/colleges';
  const pageSubtitle = isCourse ? 'Manage tabs and content blocks for this course' : isExam ? 'Manage tabs and content blocks for this exam' : 'Manage tabs and content blocks for this college';
  const createSection = useCreateContentSection();
  const updateSection = useUpdateContentSection();
  const deleteSection = useDeleteContentSection();
  const [editSection, setEditSection] = useState<ContentSection | null>(null);
  const [viewTab, setViewTab] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [collapsedTabs, setCollapsedTabs] = useState<Set<string>>(new Set());

  // Form state
  const [selectedTab, setSelectedTab] = useState('overview');
  const [customKey, setCustomKey] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formContentType, setFormContentType] = useState('richtext');
  const [formContent, setFormContent] = useState<unknown>(getDefaultContent('richtext'));
  const [formOrder, setFormOrder] = useState(0);

  const grouped = useMemo(() => {
    if (!sections) return {};
    const groups: Record<string, ContentSection[]> = {};
    for (const s of sections) {
      if (!groups[s.sectionKey]) groups[s.sectionKey] = [];
      groups[s.sectionKey].push(s);
    }
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => a.order - b.order);
    }
    return groups;
  }, [sections]);

  const sortedKeys = useMemo(() => {
    const keys = Object.keys(grouped);
    return keys.sort((a, b) => {
      const ai = tabOrder.indexOf(a);
      const bi = tabOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [grouped, tabOrder]);

  const tabLabel = (key: string) => {
    const found = TAB_OPTIONS.find(t => t.value === key);
    return found ? found.label : key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ');
  };

  const toggleTab = (key: string) => {
    setCollapsedTabs(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const resetForm = () => {
    setSelectedTab('overview');
    setCustomKey('');
    setFormTitle('');
    setFormContentType('richtext');
    setFormContent(getDefaultContent('richtext'));
    setFormOrder(0);
  };

  const openCreate = () => {
    resetForm();
    // Auto-set order to next available
    const maxOrder = sections?.reduce((max, s) => Math.max(max, s.order), -1) ?? -1;
    setFormOrder(maxOrder + 1);
    setShowCreate(true);
  };

  const handleCreate = () => {
    const sectionKey = selectedTab === '__custom__' ? customKey.trim().toLowerCase().replace(/\s+/g, '-') : selectedTab;
    if (!sectionKey || !formTitle.trim()) return;
    createSection.mutate(
      {
        ...(isCourse ? { course: courseId! } : isExam ? { exam: examId! } : { college: collegeId! }),
        sectionKey,
        title: formTitle,
        contentType: formContentType as any,
        content: serializeContent(formContentType, formContent),
        order: formOrder,
      },
      { onSuccess: () => { setShowCreate(false); resetForm(); } }
    );
  };

  const openEdit = (s: ContentSection) => {
    setEditSection(s);
    setFormTitle(s.title);
    setFormContentType(s.contentType);
    setFormContent(parseContentForEditor(s));
    setFormOrder(s.order);
  };

  const handleUpdate = () => {
    if (!editSection) return;
    updateSection.mutate(
      {
        id: editSection._id,
        data: {
          title: formTitle,
          contentType: formContentType as any,
          content: serializeContent(formContentType, formContent),
          order: formOrder,
        },
      },
      { onSuccess: () => { setEditSection(null); resetForm(); } }
    );
  };

  const handleContentTypeChange = (newType: string) => {
    setFormContentType(newType);
    setFormContent(getDefaultContent(newType));
  };

  if (isLoading) return <LoadingOverlay />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={backLink} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Content Sections</h1>
            <p className="text-sm text-gray-500">{pageSubtitle}</p>
          </div>
        </div>
        <PermissionGuard permission={PERMISSIONS.CONTENT_SECTION_CREATE}>
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Section</Button>
        </PermissionGuard>
      </div>

      {/* Empty state */}
      {sortedKeys.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-1">No content sections yet</p>
            <p className="text-sm text-gray-400 mb-4">Add sections like Overview, Placements, Admission to build the college detail page.</p>
            <PermissionGuard permission={PERMISSIONS.CONTENT_SECTION_CREATE}>
              <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add First Section</Button>
            </PermissionGuard>
          </div>
        </Card>
      )}

      {/* Grouped sections */}
      {sortedKeys.map(key => {
        const items = grouped[key];
        const isCollapsed = collapsedTabs.has(key);
        return (
          <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
              <button
                onClick={() => toggleTab(key)}
                className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1 -mx-2 transition-colors"
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                <span className="font-semibold text-gray-800">{tabLabel(key)}</span>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{items.length} block{items.length !== 1 ? 's' : ''}</span>
              </button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setViewTab(key)} title="View all content">
                  <Eye className="h-4 w-4 text-brand-500" />
                </Button>
                <span className="text-xs text-gray-400 font-mono">{key}</span>
              </div>
            </div>
            {!isCollapsed && (
              <div className="divide-y divide-gray-100">
                {items.map((s) => {
                  const Icon = CONTENT_TYPE_ICONS[s.contentType] || FileText;
                  return (
                    <div key={s._id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-gray-300" />
                        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-4 w-4 text-brand-500" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm">{s.title}</h3>
                          <p className="text-xs text-gray-500">
                            <span className="capitalize">{s.contentType}</span> &middot; Order: {s.order}
                            {!s.isVisible && <span className="ml-2 text-brand-500 font-medium">(hidden)</span>}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{getContentPreview(s)}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <PermissionGuard permission={PERMISSIONS.CONTENT_SECTION_UPDATE}>
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => updateSection.mutate({ id: s._id, data: { isVisible: !s.isVisible } })}
                            title={s.isVisible ? 'Hide' : 'Show'}
                          >
                            {s.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                          </Button>
                        </PermissionGuard>
                        <PermissionGuard permission={PERMISSIONS.CONTENT_SECTION_UPDATE}>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(s)} title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </PermissionGuard>
                        <PermissionGuard permission={PERMISSIONS.CONTENT_SECTION_DELETE}>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(s._id)} title="Delete">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </PermissionGuard>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* View Modal */}
      <Modal
        isOpen={!!viewTab}
        onClose={() => setViewTab(null)}
        title={viewTab ? tabLabel(viewTab) : ''}
        size="xl"
      >
        {viewTab && grouped[viewTab] && (
          <div className="space-y-6">
            {grouped[viewTab].map((s) => (
              <div key={s._id}>
                <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-3">
                  <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
                  {s.title}
                </h3>
                <ViewContentRenderer section={s} />
              </div>
            ))}
            <div className="flex pt-2 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setViewTab(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showCreate || !!editSection}
        onClose={() => { setShowCreate(false); setEditSection(null); resetForm(); }}
        title={editSection ? 'Edit Section' : 'New Section'}
        size="xl"
      >
        <div className="space-y-4">
          {/* Tab selector (create only) */}
          {!editSection && (
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Tab (Section Key)"
                options={tabOptions}
                value={selectedTab}
                onChange={e => setSelectedTab(e.target.value)}
              />
              {selectedTab === '__custom__' && (
                <Input
                  label="Custom Section Key"
                  placeholder="e.g. hostel-life"
                  value={customKey}
                  onChange={e => setCustomKey(e.target.value)}
                />
              )}
            </div>
          )}
          {editSection && (
            <div className="text-sm text-gray-500">
              Tab: <span className="font-mono font-medium text-gray-700">{editSection.sectionKey}</span>
            </div>
          )}

          {/* Title + Type + Order */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Input
                label="Section Title"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="e.g. Placement Statistics"
              />
            </div>
            <div>
              <Select
                label="Content Type"
                options={CONTENT_TYPES.map(t => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }))}
                value={formContentType}
                onChange={e => handleContentTypeChange(e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Order"
                type="number"
                value={formOrder}
                onChange={e => setFormOrder(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Content Editor */}
          <ContentEditor
            contentType={formContentType}
            value={formContent}
            onChange={setFormContent}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <Button
              onClick={editSection ? handleUpdate : handleCreate}
              isLoading={createSection.isPending || updateSection.isPending}
            >
              {editSection ? 'Update Section' : 'Create Section'}
            </Button>
            <Button variant="secondary" onClick={() => { setShowCreate(false); setEditSection(null); resetForm(); }}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteSection.mutate(deleteId); setDeleteId(null); } }}
        title="Delete Section"
        message="Are you sure you want to delete this content section? This cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
