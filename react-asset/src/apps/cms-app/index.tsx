import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { CMSWrapperProps, RootState } from '../../types';
import { store } from '../../store';
import { setBusinessUnitKey } from '../../store/pages.slice';
import { fetchContentTypesThunk } from '../../store/content-type.slice';
import { 
  Button, 
  Card, 
  Breadcrumbs, 
  ToggleButton, 
  LoadingSpinner,
  ErrorMessage,
  type BreadcrumbItem
} from '../../components';
import { ContentTypeApp } from '../content-type-app';

const Container = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  font-family: system-ui, sans-serif;
`;

const Header = styled.header<{ enabled: boolean }>`
  display: ${props => props.enabled ? 'flex' : 'none'};
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  background-color: white;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  width: 350px;
  cursor: pointer;
  transition: color 0.2s;
  position: relative;

  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }

  .original-title {
    display: inline;
  }

  .hover-title {
    display: none;
  }

  &:hover .original-title {
    display: none;
  }

  &:hover .hover-title {
    display: inline;
  }
`;

const WelcomeContainer = styled.div`
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const WelcomeHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 0;
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const AppCard = styled(Card)<{ enabled: boolean }>`
  cursor: ${props => props.enabled ? 'pointer' : 'not-allowed'};
  opacity: ${props => props.enabled ? 1 : 0.6};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: ${props => props.enabled ? 'translateY(-4px)' : 'none'};
    box-shadow: ${props => props.enabled ? '0 8px 16px rgba(0, 0, 0, 0.2)' : 'inherit'};
  }
`;

const CardContent = styled.div`
  text-align: center;
  padding: 1rem;
`;

const CardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #333;
`;

const CardDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const AppContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const AppContent = styled.div`
  flex: 1;
  overflow: hidden;
`;

const BackButtonContainer = styled.div`
  padding: 1rem 2rem;
  border-bottom: 1px solid #ddd;
`;

const ConfigSection = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  border: 1px solid #e1e5e9;
`;

const ConfigTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
`;

const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const ConfigItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
`;

const ConfigLabel = styled.label`
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
`;

const ConfigValue = styled.span`
  font-size: 0.9rem;
  color: #333;
  background-color: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
`;

type ActiveApp = 'welcome' | 'pages' | 'content-type' | 'content-item';

export const CMSWrapper: FC<CMSWrapperProps> = ({
  baseURL,
  businessUnitKey,
  locale = 'en-US',
  availableLocales = ['en-US'],
  pagesAppEnabled = false,
  contentTypeAppEnabled = false,
  contentItemAppEnabled = false,
  headerEnabled = true,
}) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.contentType);
  
  const [activeApp, setActiveApp] = useState<ActiveApp>('welcome');
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);

  // Auto-detect single app mode
  useEffect(() => {
    const enabledApps = [
      pagesAppEnabled && 'pages',
      contentTypeAppEnabled && 'content-type', 
      contentItemAppEnabled && 'content-item'
    ].filter(Boolean);

    if (enabledApps.length === 1) {
      setActiveApp(enabledApps[0] as ActiveApp);
    }
  }, [pagesAppEnabled, contentTypeAppEnabled, contentItemAppEnabled]);

  useEffect(() => {
    if (businessUnitKey) {
      dispatch(setBusinessUnitKey(businessUnitKey) as any);
      if (baseURL) {
        dispatch(fetchContentTypesThunk({ baseUrl: baseURL, businessUnitKey }) as any);
      }
    }
  }, [dispatch, businessUnitKey, baseURL]);

  useEffect(() => {
    updateBreadcrumbs();
  }, [activeApp]);

  const updateBreadcrumbs = () => {
    const items: BreadcrumbItem[] = [];
    
    if (activeApp !== 'welcome') {
      items.push({
        label: 'CMS',
        onClick: () => setActiveApp('welcome')
      });
    }

    switch (activeApp) {
      case 'pages':
        items.push({ label: 'Pages' });
        break;
      case 'content-type':
        items.push({ label: 'Content Types' });
        break;
      case 'content-item':
        items.push({ label: 'Content Items' });
        break;
    }

    setBreadcrumbItems(items);
  };

  const handleAppSelect = (app: ActiveApp) => {
    if (
      (app === 'pages' && !pagesAppEnabled) ||
      (app === 'content-type' && !contentTypeAppEnabled) ||
      (app === 'content-item' && !contentItemAppEnabled)
    ) {
      return;
    }
    setActiveApp(app);
  };

  const renderHeader = () => (
    <Header enabled={headerEnabled}>
      <Title onClick={() => setActiveApp('welcome')}>
        <span className="original-title">contentools</span>
        <span className="hover-title">← Back to Dashboard</span>
      </Title>
      <Breadcrumbs items={breadcrumbItems} />
    </Header>
  );

  const renderWelcome = () => (
    <WelcomeContainer>
      <WelcomeHeader>
        <WelcomeTitle>Content Management System</WelcomeTitle>
        <WelcomeSubtitle>
          Manage your content with our comprehensive CMS tools
        </WelcomeSubtitle>
      </WelcomeHeader>

      <CardsContainer>
        <AppCard 
          enabled={pagesAppEnabled}
          onClick={() => handleAppSelect('pages')}
          width="300px"
          height="250px"
        >
          <CardContent>
            <CardIcon>📄</CardIcon>
            <CardTitle>Pages</CardTitle>
            <CardDescription>
              Create and manage your website pages with our visual page builder.
              Add components, manage layouts, and publish content.
            </CardDescription>
          </CardContent>
        </AppCard>

        <AppCard 
          enabled={contentTypeAppEnabled}
          onClick={() => handleAppSelect('content-type')}
          width="300px"
          height="250px"
        >
          <CardContent>
            <CardIcon>🧩</CardIcon>
            <CardTitle>Content Types</CardTitle>
            <CardDescription>
              Define and manage content type schemas. Create reusable components
              with custom properties and validation rules.
            </CardDescription>
          </CardContent>
        </AppCard>

        <AppCard 
          enabled={contentItemAppEnabled}
          onClick={() => handleAppSelect('content-item')}
          width="300px"
          height="250px"
        >
          <CardContent>
            <CardIcon>📝</CardIcon>
            <CardTitle>Content Items</CardTitle>
            <CardDescription>
              Create and manage individual content items based on your defined
              content types. Edit, publish, and organize your content.
            </CardDescription>
          </CardContent>
        </AppCard>
      </CardsContainer>

      <ConfigSection>
        <ConfigTitle>Configuration</ConfigTitle>
        <ConfigGrid>
          <ConfigItem>
            <ConfigLabel>Business Unit:</ConfigLabel>
            <ConfigValue>{businessUnitKey || 'Not set'}</ConfigValue>
          </ConfigItem>
          <ConfigItem>
            <ConfigLabel>Base URL:</ConfigLabel>
            <ConfigValue>{baseURL || 'Not set'}</ConfigValue>
          </ConfigItem>
          <ConfigItem>
            <ConfigLabel>Locale:</ConfigLabel>
            <ConfigValue>{locale}</ConfigValue>
          </ConfigItem>
          <ConfigItem>
            <ConfigLabel>Available Locales:</ConfigLabel>
            <ConfigValue>{availableLocales.join(', ')}</ConfigValue>
          </ConfigItem>
        </ConfigGrid>
        
        <ConfigGrid style={{ marginTop: '1rem' }}>
          <ConfigItem>
            <ConfigLabel>Pages App:</ConfigLabel>
            <ToggleButton 
              checked={pagesAppEnabled} 
              onChange={() => {}} 
              disabled
            />
          </ConfigItem>
          <ConfigItem>
            <ConfigLabel>Content Types App:</ConfigLabel>
            <ToggleButton 
              checked={contentTypeAppEnabled} 
              onChange={() => {}} 
              disabled
            />
          </ConfigItem>
          <ConfigItem>
            <ConfigLabel>Content Items App:</ConfigLabel>
            <ToggleButton 
              checked={contentItemAppEnabled} 
              onChange={() => {}} 
              disabled
            />
          </ConfigItem>
          <ConfigItem>
            <ConfigLabel>Header:</ConfigLabel>
            <ToggleButton 
              checked={headerEnabled} 
              onChange={() => {}} 
              disabled
            />
          </ConfigItem>
        </ConfigGrid>
      </ConfigSection>
    </WelcomeContainer>
  );

  const renderApp = () => {
    switch (activeApp) {
      case 'pages':
        return (
          <AppContainer>
            <BackButtonContainer>
              <Button 
                variant="secondary" 
                onClick={() => setActiveApp('welcome')}
              >
                ← Back to Dashboard
              </Button>
            </BackButtonContainer>
            <AppContent>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Pages App</h2>
                <p>Pages management interface will be implemented here.</p>
                <p>Base URL: {baseURL}</p>
                <p>Business Unit: {businessUnitKey}</p>
              </div>
            </AppContent>
          </AppContainer>
        );
      
      case 'content-type':
        return (
          <AppContainer>
            <BackButtonContainer>
              <Button 
                variant="secondary" 
                onClick={() => setActiveApp('welcome')}
              >
                ← Back to Dashboard
              </Button>
            </BackButtonContainer>
            <AppContent>
              {/* <ContentTypeApp baseURL={baseURL} /> */}
            </AppContent>
          </AppContainer>
        );
      
      case 'content-item':
        return (
          <AppContainer>
            <BackButtonContainer>
              <Button 
                variant="secondary" 
                onClick={() => setActiveApp('welcome')}
              >
                ← Back to Dashboard
              </Button>
            </BackButtonContainer>
            <AppContent>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Content Items App</h2>
                <p>Content item management interface will be implemented here.</p>
                <p>Base URL: {baseURL}</p>
                <p>Business Unit: {businessUnitKey}</p>
              </div>
            </AppContent>
          </AppContainer>
        );
      
      default:
        return renderWelcome();
    }
  };

  if (!businessUnitKey) {
    return (
      <Container>
        <ErrorMessage 
          message="The 'businessUnitKey' prop is required for the CMS to function properly."
          type="warning"
        />
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <LoadingSpinner size="large" />
          <p>Loading CMS...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage 
          message={`Error loading CMS: ${error}`}
          type="error"
        />
      </Container>
    );
  }

  return (
    <Container>
      {renderHeader()}
      {renderApp()}
    </Container>
  );
}; 