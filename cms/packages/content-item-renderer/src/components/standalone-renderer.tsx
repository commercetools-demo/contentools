import { StateProvider } from "@commercetools-demo/cms-state";
import { ContentItemRendererProps } from "..";
import ContentItemResolver from "./content-item-resolver";

const StandaloneRenderer: React.FC<ContentItemRendererProps> = (props) => {
    if (!props.baseURL) {
      return null;
    }
  
    return (
      <StateProvider baseURL={props.baseURL}>
        <ContentItemResolver {...props} />
      </StateProvider>
    );
  };

  export default StandaloneRenderer;