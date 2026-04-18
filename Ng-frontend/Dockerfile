FROM node:14

WORKDIR /app

# install dependencies first (better cache)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# copy source code
COPY . .

# expose Angular dev server port
EXPOSE 4200

# مهم جدًا: نخلي السيرفر يسمع من برا الكونتينر
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]










# # FROM nginx:1.17.1-alpine
# # COPY ./dist/Ng-frontend /usr/share/nginx/html

# FROM node:14
    
# # Create a directory where our app will be placed
# RUN mkdir -p /app

# # Change directory so that our commands run inside this new directory
# WORKDIR /app

# # Copy dependency definitions
# COPY package*.json /app/

# # Install dependecies
# RUN npm install

# # Get all the code needed to run the app
# COPY . /app/

# # Expose the port the app runs in
# EXPOSE 4200

# # Serve the app
# CMD ["npm", "start"]
