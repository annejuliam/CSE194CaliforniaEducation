import { useState } from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'

const sections = ["Explore Map", "Compare Schools", "Data Sources", "About"]

const toId = (label) => label.toLowerCase().replace(/\s+/g, "-")

export default function NavBar() {
    const [activeSection, setActiveSection] = useState(toId(sections[0]))

    return (
        <Box
            component="nav"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "space-between", md: "flex-start" },
                gap: { xs: 0, md: 1 },
                px: { xs: 0.5, md: 1 },
                py: 1,
                position: "sticky",
                top: 0,
                zIndex: 1000,
                bgcolor: "background.paper",
                borderBottom: 1,
                borderColor: "divider",
            }}
        >
            <Typography variant="h6" sx={{ mr: { md: 2 }, fontWeight: 700 }}>
                Project Name
            </Typography>

            {sections.map((section) => {
                const id = toId(section)
                const isActive = activeSection === id
                return (
                    <ButtonBase
                        key={id}
                        component="a"
                        href={`#${id}`}
                        onClick={() => setActiveSection(id)}
                        aria-current={isActive ? "page" : undefined}
                        sx={{
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 1,
                            fontWeight: isActive ? 700 : 400,
                            color: isActive ? "primary.main" : "text.primary",
                            "&:hover": { bgcolor: "action.hover" },
                        }}
                    >
                        {section}
                    </ButtonBase>
                )
            })}
        </Box>
    )
}