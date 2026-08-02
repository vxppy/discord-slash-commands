import { slashCommand } from '..';

const commnd = slashCommand({ name: 'wow', description: 'oh no' })
    .addChannelOption({
        name: 'noo',
        description: 'wow',
    })
    .callback(async ({ interaction, options }) => {});

console.log(commnd.Options);
