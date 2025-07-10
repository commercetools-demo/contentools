import React from 'react'
import ContentItem from '@commercetools-demo/cms-content-items'
type Props = {}

const ContentItemApp = (props: Props) => {
  return (
    <ContentItem baseURL="http://localhost:8080/service" businessUnitKey="central-texas-animal-hospital" locale='en-US' />
  )
}

export default ContentItemApp