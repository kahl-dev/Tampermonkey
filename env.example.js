const ENV_VALUES = { TOGGL_API_TOKEN: '', TOGGL_CLIENT_ID: '', TOGGL_WORKSPACE_ID: '' }
Object.keys(ENV_VALUES).forEach((key) => GM.setValue(key, ENV_VALUES[key]));
