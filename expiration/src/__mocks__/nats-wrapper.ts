// Our mock version for the nats-wrapper giving a fake nats client for testing
export const natsWrapper = {
  client: {
    //     publish: (subject: string, data: string, callback: () => void) => {
    //       callback();
    //     }, // This is the fake version of publish
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ), // This is the mock version of publish
  },
};
