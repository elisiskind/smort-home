import { Box, Stack, Tab, tabClasses, TabList, TabPanel, Tabs } from '@mui/joy';
import { Lights } from './pages/Lights';
import { SonosDevices } from './pages/SonosDevices';
import { Automations } from './pages/Automations';
import { BeanRemediation } from './pages/BeanRemediation';

export const App = () => {
  return (
    <Stack sx={{ minHeight: '100vh', padding: 2, gap: 2 }}>
      <Box>Smort home!</Box>
      <Tabs
        aria-label="Basic tabs"
        defaultValue={0}
        sx={{
          flex: 1,
          border: '1px solid',
          borderColor: 'background.level2',
          borderRadius: 'xl',
        }}
      >
        <TabList
          disableUnderline
          sx={{
            p: 0.5,
            gap: 0.5,
            borderRadius: 'xl',
            bgcolor: 'background.level1',
            [`& .${tabClasses.root}[aria-selected="true"]`]: {
              boxShadow: 'sm',
              bgcolor: 'background.surface',
            },
          }}
        >
          <Tab disableIndicator>Lights</Tab>
          <Tab disableIndicator>Speakers</Tab>
          <Tab disableIndicator>Automations</Tab>
          <Tab disableIndicator>Bean Remediation</Tab>
        </TabList>
        <TabPanel value={0}>
          <Lights />
        </TabPanel>
        <TabPanel value={1}>
          <SonosDevices />
        </TabPanel>
        <TabPanel value={2}>
          <Automations />
        </TabPanel>
        <TabPanel value={3}>
          <BeanRemediation />
        </TabPanel>
      </Tabs>
    </Stack>
  );
};
