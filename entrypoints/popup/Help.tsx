import React from "react";
import { Container, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { browser } from "wxt/browser";

export function Help() {
  return (
    <Container disableGutters sx={{ p: 1 }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        {browser.i18n.getMessage("aboutEqualizer")}
      </Typography>
      <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
        <ListItem>
          <ListItemText
            primary="60 HZ"
            secondary={browser.i18n.getMessage("60HZ")}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="230 HZ"
            secondary={browser.i18n.getMessage("230HZ")}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="910 HZ"
            secondary={browser.i18n.getMessage("910HZ")}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="4K HZ (4000 HZ)"
            secondary={browser.i18n.getMessage("4000HZ")}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="14K HZ (14000 HZ)"
            secondary={browser.i18n.getMessage("14000HZ")}
          />
        </ListItem>
      </List>
    </Container>
  );
}
