import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useTheme } from "@design";
import {
  Screen,
  Header,
  Section,
  Text,
  Button,
  Card,
  Input,
  Chip,
  Badge,
  Divider,
  Icon,
  Spinner,
  StatTile,
  Sparkline,
  ProgressRing,
  DataTable,
  Skeleton,
} from "../components";

export const PlaygroundScreen: React.FC = () => {
  const theme = useTheme();
  const [selectedChip, setSelectedChip] = useState("all");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const sampleTableData = [
    { id: "1", name: "Groceries", category: "Food", amount: "KES 4,500" },
    { id: "2", name: "Electricity", category: "Utilities", amount: "KES 2,100" },
    { id: "3", name: "Internet", category: "Utilities", amount: "KES 3,500" },
  ];

  return (
    <Screen style={styles.container}>
      <Header title="Component Playground" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Typography Section */}
        <Section title="Typography">
          <Text variant="display">Display Text</Text>
          <Text variant="h1">Heading 1</Text>
          <Text variant="h2">Heading 2</Text>
          <Text variant="h3">Heading 3</Text>
          <Text variant="body">Body regular text description.</Text>
          <Text variant="bodyStrong">Body Strong text emphasis.</Text>
          <Text variant="caption" color="textMuted">Caption text muted.</Text>
          <Text variant="mono" color="accent">mono: UUID_0192A7C4</Text>
        </Section>

        <Divider style={styles.divider} />

        {/* Buttons Section */}
        <Section title="Buttons">
          <View style={styles.rowWrap}>
            <Button
              title="Primary"
              variant="primary"
              size="md"
              onPress={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1500);
              }}
              loading={loading}
            />
            <Button title="Secondary" variant="secondary" size="md" />
            <Button title="Danger" variant="danger" size="md" />
            <Button title="Ghost" variant="ghost" size="md" />
          </View>
        </Section>

        <Divider style={styles.divider} />

        {/* Form Inputs & Chips */}
        <Section title="Inputs & Chips">
          <Input
            label="Search or Memo"
            placeholder="Type something..."
            value={inputValue}
            onChangeText={setInputValue}
            hint="Input with custom theme styling"
          />
          <View style={[styles.rowWrap, { marginTop: 12 }]}>
            <Chip
              label="All Items"
              selected={selectedChip === "all"}
              onPress={() => setSelectedChip("all")}
            />
            <Chip
              label="Expenses"
              selected={selectedChip === "exp"}
              onPress={() => setSelectedChip("exp")}
            />
            <Chip
              label="Income"
              selected={selectedChip === "inc"}
              onPress={() => setSelectedChip("inc")}
            />
          </View>
          <View style={[styles.rowWrap, { marginTop: 12 }]}>
            <Badge label="Default" variant="default" />
            <Badge label="Accent" variant="accent" />
            <Badge label="Success" variant="success" />
            <Badge label="Warning" variant="warning" />
            <Badge label="Danger" variant="danger" />
          </View>
        </Section>

        <Divider style={styles.divider} />

        {/* Data Display Primitives */}
        <Section title="Data Display">
          <View style={styles.statsRow}>
            <StatTile
              label="Monthly Spend"
              value="KES 42,500"
              delta={{ value: "+12%", isPositive: false, label: "vs last month" }}
              icon="wallet-outline"
            />
            <StatTile
              label="Active Savings"
              value="KES 180,000"
              delta={{ value: "+8%", isPositive: true }}
              icon="trending-up-outline"
            />
          </View>

          <Card style={styles.chartCard} padding="md">
            <View style={styles.chartHeader}>
              <Text variant="captionStrong" color="textMuted">
                SPARKLINE TREND
              </Text>
              <ProgressRing progress={0.72} size={48} strokeWidth={5} showPercentText />
            </View>
            <Sparkline
              data={[12, 19, 14, 25, 22, 30, 28, 38, 45]}
              width={280}
              height={50}
              color={theme.colors.accent}
            />
          </Card>

          <DataTable
            style={{ marginTop: 12 }}
            columns={[
              { key: "name", header: "Item", width: 120 },
              { key: "category", header: "Category", width: 100 },
              { key: "amount", header: "Amount", align: "right" },
            ]}
            data={sampleTableData}
            keyExtractor={(item) => item.id}
          />
        </Section>

        <Divider style={styles.divider} />

        {/* Feedback Primitives */}
        <Section title="Feedback & Loading">
          <View style={styles.rowWrap}>
            <Spinner size="small" />
            <Spinner size="large" />
            <Icon name="checkmark-circle" size={24} color={theme.colors.success} />
            <Icon name="alert-circle" size={24} color={theme.colors.warning} />
          </View>
          <View style={{ marginTop: 12 }}>
            <Skeleton width="100%" height={20} style={{ marginBottom: 8 }} />
            <Skeleton width="70%" height={20} />
          </View>
        </Section>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  divider: {
    marginVertical: 16,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  chartCard: {
    marginTop: 8,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
});

export default PlaygroundScreen;
