# Starting Image
FROM node:22-bullseye-slim
# Set the working directory in the container
WORKDIR /app
# Copy the application package and lock
COPY . /app
# Install app dependencies using PNPM
RUN npm install -g pnpm
# Run pnpm install
RUN pnpm install
# Create build
RUN pnpm build
#Add .env
COPY .env /app/.env
# Expose the app
EXPOSE 3000
# Start the application
CMD ["pnpm", "start"]