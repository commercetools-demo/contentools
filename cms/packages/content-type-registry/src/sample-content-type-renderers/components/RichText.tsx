import React from 'react';
import styled from 'styled-components';

interface RichTextProps {
  content?: string;
}

const RichTextContainer = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
    line-height: 1.2;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    line-height: 1.3;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    line-height: 1.4;
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  a {
    color: #0066cc;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #004080;
      text-decoration: underline;
    }
  }

  ul, ol {
    margin-bottom: 1rem;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }

  blockquote {
    border-left: 4px solid #e0e0e0;
    margin-left: 0;
    margin-right: 0;
    padding-left: 1rem;
    color: #555;
    font-style: italic;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1rem 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;

    th, td {
      border: 1px solid #e0e0e0;
      padding: 0.5rem;
    }

    th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
  }
`;

export const RichText: React.FC<RichTextProps> = ({
  content = '<p>Enter your content here...</p>',
}) => {
  return (
    <RichTextContainer
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichText; 