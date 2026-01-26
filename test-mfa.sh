#!/bin/bash

echo "Running MFA Tests..."
echo "===================="

# Run all MFA-related tests
yarn test --run src/modules/Auth/features/Login/MFAForm/MFAForm.test.tsx \
  src/modules/Auth/features/Login/MFAForm/RecoveryCodeForm.test.tsx \
  src/modules/Auth/features/Login/MFAForm/MFAForm.schema.test.ts \
  src/modules/Auth/utils/mfa.utils.test.ts

echo ""
echo "MFA Tests Complete!"