import OrganizationTabs from '@/components/Organizations'
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'

export default function Home() {
  return <div className='bg-[white] h-screen w-screen'><Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Temelio
        </Typography>
      </Toolbar>
    </AppBar>
  </Box>
    <OrganizationTabs />
  </div>
}
