import { useEffect, useState } from 'react';
import { useCustomObject } from '../../controllers/custom-object.controller';
import CMSAppWrapper from '../web-component-wrapper';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import '@commercetools-demo/cms-asset';

const SHARED_DEPLOYED_URL = 'cms-app-deployed-url';
const SHARED_CMS_CONTAINER = 'cms-shared-container';

const Welcome = () => {
  const context = useApplicationContext();
  const { getCustomObject } = useCustomObject(SHARED_CMS_CONTAINER);

  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDeployedUrl = async () => {
      try {
        const deployedUrlResult = await getCustomObject(SHARED_DEPLOYED_URL);
        setDeployedUrl(deployedUrlResult.value);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching deployed URL:', error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeployedUrl();
  }, []);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {deployedUrl && (
        <CMSAppWrapper
          baseurl={deployedUrl}
          business-unit-key="1"
          available-locales={`[${context?.project?.languages
            .map((language) => `"${language}"`)
            .join(',')}]`}
          locale={context.dataLocale ?? 'en-US'}
        />
      )}
    </div>
  );
};

export default Welcome;
