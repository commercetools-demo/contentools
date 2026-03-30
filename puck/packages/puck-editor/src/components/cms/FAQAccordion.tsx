import React, { useState } from 'react';
import { type ComponentConfig } from '@measured/puck';

export interface FAQAccordionProps {
  question1: string; answer1: string;
  question2: string; answer2: string;
  question3: string; answer3: string;
  question4: string; answer4: string;
}

const FAQRender: React.FC<FAQAccordionProps> = (props) => {
  const items = [
    [props.question1, props.answer1],
    [props.question2, props.answer2],
    [props.question3, props.answer3],
    [props.question4, props.answer4],
  ].filter(([q]) => q) as [string, string][];

  const [open, setOpen] = useState<number | null>(null);

  if (items.length === 0) return (
    <div style={{ padding: '1rem', color: '#999', fontSize: '13px' }}>No FAQ items configured</div>
  );

  return (
    <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
      {items.map(([question, answer], i) => (
        <div key={i} style={{ borderBottom: i < items.length - 1 ? '1px solid #eee' : 'none' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              textAlign: 'left',
              fontWeight: 600,
              fontSize: '1rem',
              background: '#fafafa',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {question}
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && answer && (
            <div
              dangerouslySetInnerHTML={{ __html: answer }}
              style={{
                padding: '1rem 1.25rem',
                background: 'white',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                color: '#555',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export const FAQAccordion: ComponentConfig<FAQAccordionProps> = {
  label: 'FAQ Accordion',
  fields: {
    question1: { type: 'text', label: 'Question 1' },
    answer1: { type: 'textarea', label: 'Answer 1 (HTML)' },
    question2: { type: 'text', label: 'Question 2' },
    answer2: { type: 'textarea', label: 'Answer 2 (HTML)' },
    question3: { type: 'text', label: 'Question 3' },
    answer3: { type: 'textarea', label: 'Answer 3 (HTML)' },
    question4: { type: 'text', label: 'Question 4' },
    answer4: { type: 'textarea', label: 'Answer 4 (HTML)' },
  },
  defaultProps: {
    question1: '', answer1: '',
    question2: '', answer2: '',
    question3: '', answer3: '',
    question4: '', answer4: '',
  },
  render: (props) => <FAQRender {...props} />,
};
