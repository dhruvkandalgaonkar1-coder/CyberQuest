public class Mission {

    private String name;
    private String description;
    private int rewardXP;
    private int rewardCoins;

    public Mission(
            String name,
            String description,
            int rewardXP,
            int rewardCoins) {

        this.name = name;
        this.description = description;
        this.rewardXP = rewardXP;
        this.rewardCoins = rewardCoins;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public int getRewardXP() {
        return rewardXP;
    }

    public int getRewardCoins() {
        return rewardCoins;
    }

    public void showMission() {

        System.out.println(
                "\n🎯 Mission: " + name
        );

        System.out.println(
                description
        );

        System.out.println(
                "XP Reward: " + rewardXP
        );

        System.out.println(
                "Coin Reward: " + rewardCoins
        );
    }
}