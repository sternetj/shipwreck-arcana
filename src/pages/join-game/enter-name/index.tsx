import React, { FC, useState } from "react";
import { Grid, Button, Typography, styled, TextField } from "@material-ui/core";
import { useLocalStorage } from "./use-local-storage";

interface WelcomeProps {
  title?: string;
  label: string;
  dataKey?: string;
  placeholder?: string;
  error?: string;
  onSubmit: (name: string) => any;
  onBack: () => any;
}

const CreateGame: FC<WelcomeProps> = (props) => {
  const { onSubmit, label, title, dataKey, error, children } = props;
  const { placeholder = "Name", onBack } = props;
  const [name, setName] = useLocalStorage(dataKey, "");
  const [requiredError, setError] = useState<string>();

  return (
    <Container container direction="column" alignItems="center">
      <Typography variant="h4">{title}</Typography>
      <StyledTextField
        autoFocus
        variant="outlined"
        placeholder={placeholder}
        value={name}
        inputProps={{
          maxLength: 25,
        }}
        error={!!error || !!requiredError}
        helperText={error || requiredError}
        onKeyPress={(e) => e.key === "Enter" && onSubmit(name)}
        onChange={(e) => setName(e.target.value)}
      />
      {children}
      <Grid container direction="row" justify="space-evenly">
        <ActionButton onClick={() => onBack()}>Back</ActionButton>
        <ActionButton
          color="primary"
          variant="contained"
          onClick={() => {
            if (!name) {
              return setError("Field cannot be blank");
            }
            setError(undefined);
            onSubmit(name);
          }}>
          {label}
        </ActionButton>
      </Grid>
    </Container>
  );
};

const Container = styled(Grid)({
  "&>*:not(:last-child)": {
    paddingBottom: ".75rem",
  },
});

const StyledTextField = styled(TextField)({
  textAlign: "center",
});

const ActionButton = styled(Button)({});
ActionButton.defaultProps = {
  variant: "outlined",
  size: "large",
};

export default CreateGame;
