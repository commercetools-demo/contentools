import { useStateContext } from "@commercetools-demo/cms-state";
import { ContentItemRendererProps } from "..";
import ContentItemResolver from "./content-item-resolver";

const ContextualRenderer: React.FC<ContentItemRendererProps> = (props) => {
    // Always call the hook - this follows React's Rules of Hooks
    const context = useStateContext();
    
    // If context is available, render the resolver
    if (context) {
      return <ContentItemResolver {...props} />;
    }
    
    // This should not happen if context is properly set up
    return <ContentItemResolver {...props} />;
  };
  
  export default ContextualRenderer;