import React from "react";
import { Screen, EmptyState } from "@components/layout";
import { Button } from "@components/primitives";
import { useTheme } from "@design";

const NotFoundScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  return (
    <Screen edges={["top", "bottom"]}>
      <EmptyState
        title="Screen not found"
        description="That route doesn't exist yet."
        action={
          <Button
            label="Go home"
            onPress={() => navigation.replace("Main")}
            style={{ marginTop: theme.spacing.md }}
          />
        }
      />
    </Screen>
  );
};

export default NotFoundScreen;
